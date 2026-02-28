import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { OrderDetail } from "@/types/dashboard";

interface ClientFilesCardProps {
  order: OrderDetail;
}

export function ClientFilesCard({ order }: ClientFilesCardProps) {
  if (!order.clientFiles || order.clientFiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            ملفات العميل
          </CardTitle>
          <CardDescription>
            قم بتحميل الملفات التي رفعها العميل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">لا توجد ملفات مرفقة</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          ملفات العميل
        </CardTitle>
        <CardDescription>
          قم بتحميل الملفات التي رفعها العميل
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.clientFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (file.url && file.url !== "#") {
                    window.open(file.url, "_blank");
                  }
                }}
              >
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
