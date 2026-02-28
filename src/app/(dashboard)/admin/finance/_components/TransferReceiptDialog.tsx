"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transfer } from "./TransferTable";
import Image from "next/image";

interface TransferReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer: Transfer | null;
}

export function TransferReceiptDialog({
  open,
  onOpenChange,
  transfer,
}: TransferReceiptDialogProps) {
  if (!transfer || !transfer.receiptImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>إثبات التحويل - {transfer.employeeName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative w-full h-96 rounded-lg overflow-hidden border">
            <Image
              src={transfer.receiptImage}
              alt="إثبات التحويل"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
