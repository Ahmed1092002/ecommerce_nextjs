"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AddressType,
  CreateAddressData,
  UpdateAddressData,
} from "@/types/address";
import { useEffect } from "react";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  phone: z.string().min(1, "Phone is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip Code is required"),
  country: z.string().min(1, "Country is required"),
  type: z.nativeEnum(AddressType),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  initialData?: UpdateAddressData;
  onSubmit: (data: CreateAddressData | UpdateAddressData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  isSeller?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  isSeller,
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      type: AddressType.HOME,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        label: initialData.label,
        phone: initialData.phone,
        street: initialData.street,
        city: initialData.city,
        state: initialData.state,
        zipCode: initialData.zipCode,
        country: initialData.country,
        type: initialData.type,
        isDefault: initialData.isDefault,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: AddressFormValues) => {
    // Cast data to match expected types for Create/Update
    // The form values match the structure, but we need to handle the ID for update
    if (initialData) {
      await onSubmit({ ...data, id: initialData.id } as UpdateAddressData);
    } else {
      await onSubmit(data as CreateAddressData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label (e.g., Home, Office)</FormLabel>
                <FormControl>
                  <Input placeholder="Home" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="United States" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-amber-50 ">
                  {isSeller ? (
                    <>
                      <SelectItem value={AddressType.WAREHOUSE}>
                        Warehouse
                      </SelectItem>
                      <SelectItem value={AddressType.STORE}>Store</SelectItem>
                      <SelectItem value={AddressType.PICKUP_LOCATION}>
                        Pickup Location
                      </SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value={AddressType.HOME}>Home</SelectItem>
                      <SelectItem value={AddressType.WORK}>Work</SelectItem>
                      <SelectItem value={AddressType.OTHER}>Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-none p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Set as default address</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-(--primary) text-white hover:bg-(--primary)/90"
          >
            {isLoading
              ? "Saving..."
              : initialData
              ? "Update Address"
              : "Add Address"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
