import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrderDetailFile } from "@/types/dashboard";

interface DeliverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeliver: (files: OrderDetailFile[], links: string) => void;
  isLoading?: boolean;
}

export function DeliverDialog({
  open,
  onOpenChange,
  onDeliver,
  isLoading = false,
}: DeliverDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deliveryLinks, setDeliveryLinks] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    // Convert files to OrderDetailFile format
    const files: OrderDetailFile[] = selectedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file), // In production, upload to storage first
    }));

    onDeliver(files, deliveryLinks);
    // Reset form
    setSelectedFiles([]);
    setDeliveryLinks("");
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setDeliveryLinks("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>رفع العمل</DialogTitle>
          <DialogDescription>
            قم برفع ملفات الحل النهائية أو وضع روابط
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>رفع الملفات</Label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.zip,.rar"
            />
            <p className="text-sm text-gray-500 mt-1">
              يمكنك رفع عدة ملفات (PDF, DOCX, ZIP)
            </p>
            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    • {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label>أو روابط (Drive, Canva, إلخ)</Label>
            <Textarea
              placeholder="ضع الروابط هنا، كل رابط في سطر..."
              rows={4}
              value={deliveryLinks}
              onChange={(e) => setDeliveryLinks(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "جاري الرفع..." : "رفع العمل"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
