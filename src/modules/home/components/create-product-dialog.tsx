import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { CreateProductForm } from "./create-product-form";

type CreateProductDialogProps = {
  trigger?: ReactNode;
};

export function CreateProductDialog({ trigger }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <PlusIcon />
            {t("createProduct.title")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createProduct.title")}</DialogTitle>
          <DialogDescription>
            {t("createProduct.description")}
          </DialogDescription>
        </DialogHeader>

        <CreateProductForm
          onCancel={() => setOpen(false)}
          onCreated={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
