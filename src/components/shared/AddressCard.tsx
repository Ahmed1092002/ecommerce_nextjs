"use client";

import { AddressData } from "@/types/address";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AddressCardProps {
  address: AddressData;
  onEdit: (address: AddressData) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
      {address.isDefault && (
        <div className="absolute top-0 right-0 bg-(--primary) text-white text-xs px-3 py-1 rounded-bl-lg font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Default
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {address.label}
            </h3>
            <Badge variant="secondary" className="text-xs font-normal mt-1">
              {address.type}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-6">
        <p className="line-clamp-2">
          {address.street}, {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
        <div className="flex items-center gap-2 pt-2 text-gray-500">
          <Phone className="w-4 h-4" />
          <span>{address.phone}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-gray-50"
          onClick={() => onEdit(address)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-(--primary) hover:bg-(--primary)/10"
            onClick={() => onSetDefault(address.id)}
            disabled={isSettingDefault}
          >
            Set Default
          </Button>
        )}
      </div>
    </Card>
  );
}
