"use client";

import { useEffect, useState } from "react";
import useAddress from "@/hooks/useAddress";
import {
  AddressData,
  CreateAddressData,
  UpdateAddressData,
} from "@/types/address";
import { AddressCard } from "@/components/shared/AddressCard";
import { AddressForm } from "@/components/shared/AddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, MapPin } from "lucide-react";

export default function CustomerAddressesPage() {
  const {
    loading,
    getCustomerAddresses,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setCustomerAddressDefault,
  } = useAddress();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | undefined>(
    undefined
  );

  const fetchAddresses = async () => {
    try {
      const response = await getCustomerAddresses(0);
      if (response && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (data: CreateAddressData | UpdateAddressData) => {
    try {
      await createCustomerAddress(data as CreateAddressData);
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  const handleUpdate = async (data: CreateAddressData | UpdateAddressData) => {
    if (!editingAddress) return;
    try {
      await updateCustomerAddress(
        Number(editingAddress.id),
        data as UpdateAddressData
      );
      setEditingAddress(undefined);
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteCustomerAddress(Number(id));
        fetchAddresses();
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setCustomerAddressDefault(Number(id));
      fetchAddresses();
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const openCreateDialog = () => {
    setEditingAddress(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: AddressData) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-(--primary)" />
              My Addresses
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your shipping and billing addresses
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-(--primary) hover:opacity-90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {loading && addresses.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary)"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No addresses found
            </h3>
            <p className="text-gray-500 mt-1 mb-6">
              Add an address to speed up your checkout process
            </p>
            <Button
              onClick={openCreateDialog}
              variant="outline"
              className="border-(--primary) text-(--primary) hover:bg-(--primary)/5"
            >
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              initialData={editingAddress}
              onSubmit={editingAddress ? handleUpdate : handleCreate}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
