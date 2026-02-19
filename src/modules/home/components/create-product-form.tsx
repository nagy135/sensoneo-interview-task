import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import type {
  CreateProductInput,
  ProductPackaging,
} from "@/api/products-types";
import { useCreateProductMutation } from "../api/home-mutations";
import { AutocompleteSelect } from "@/components/autocomplete-select";
import { useAllCompaniesQuery, useAllUsersQuery } from "@/api/common-queries";
import {
  createProductSchema,
  packagingValues,
  type CreateProductFormValues,
} from "./create-product-form.schema";

type CreateProductFormProps = {
  onCreated: () => void;
  onCancel: () => void;
};

export function CreateProductForm({
  onCreated,
  onCancel,
}: CreateProductFormProps) {
  const { t } = useTranslation();
  const mutation = useCreateProductMutation();

  const packagingOptions = useMemo<
    Array<{ value: ProductPackaging; label: string }>
  >(
    () =>
      packagingValues.map((value) => ({
        value,
        label: t(`products.packaging.${value}`),
      })),
    [t],
  );

  const schema = useMemo(() => createProductSchema(t), [t]);

  const resolver: Resolver<CreateProductFormValues> = zodResolver(
    schema,
  ) as unknown as Resolver<CreateProductFormValues>;

  const defaultValues = useMemo<Partial<CreateProductFormValues>>(
    () => ({
      name: "",
      packaging: "pet",
      deposit: 0,
      volume: 330,
      companyId: undefined,
      registeredById: undefined,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver,
    defaultValues,
    mode: "onSubmit",
  });

  const companiesQuery = useAllCompaniesQuery();
  const usersQuery = useAllUsersQuery();

  async function onSubmit(values: CreateProductFormValues) {
    const input: CreateProductInput = {
      ...values,
      name: values.name.trim(),
    };

    try {
      await mutation.mutateAsync(input);
      onCreated();
    } catch {
      // handled by mutation.error bellow
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      {mutation.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t("createProduct.errorTitle")}</AlertTitle>
          <AlertDescription>
            <p>
              {mutation.error instanceof Error
                ? mutation.error.message
                : t("common.unknownError")}
            </p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="product-name">
          {t("createProduct.form.name.label")}
        </Label>
        <Input
          id="product-name"
          placeholder={t("createProduct.form.name.placeholder")}
          aria-invalid={Boolean(errors.name)}
          autoComplete="off"
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label>{t("createProduct.form.packaging.label")}</Label>
        <Controller
          control={control}
          name="packaging"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-invalid={Boolean(errors.packaging)}>
                <SelectValue
                  placeholder={t("createProduct.form.packaging.placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {packagingOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.packaging ? (
          <p className="text-sm text-destructive">{errors.packaging.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="product-deposit">
            {t("createProduct.form.deposit.label")}
          </Label>
          <Input
            id="product-deposit"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            aria-invalid={Boolean(errors.deposit)}
            {...register("deposit")}
          />
          {errors.deposit ? (
            <p className="text-sm text-destructive">{errors.deposit.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product-volume">
            {t("createProduct.form.volume.label")}
          </Label>
          <Input
            id="product-volume"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            aria-invalid={Boolean(errors.volume)}
            {...register("volume")}
          />
          {errors.volume ? (
            <p className="text-sm text-destructive">{errors.volume.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="company-id">
            {t("createProduct.form.company.label")}
          </Label>
          <Controller
            control={control}
            name="companyId"
            render={({ field }) => (
              <AutocompleteSelect
                inputId="company-id"
                value={field.value}
                onChange={(val) => field.onChange(val ? Number(val) : val)}
                placeholder={t("createProduct.form.company.placeholder")}
                ariaInvalid={Boolean(errors.companyId)}
                loading={companiesQuery.isLoading}
                options={(companiesQuery.data?.data ?? []).map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
              />
            )}
          />
          {errors.companyId ? (
            <p className="text-sm text-destructive">
              {errors.companyId.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="registered-by-id">
            {t("createProduct.form.registeredBy.label")}
          </Label>
          <Controller
            control={control}
            name="registeredById"
            render={({ field }) => (
              <AutocompleteSelect
                inputId="registered-by-id"
                value={field.value}
                onChange={(val) => field.onChange(val ? Number(val) : val)}
                placeholder={t("createProduct.form.registeredBy.placeholder")}
                ariaInvalid={Boolean(errors.registeredById)}
                loading={usersQuery.isLoading}
                options={(usersQuery.data?.data ?? []).map((u) => ({
                  value: u.id,
                  label: `${u.firstName} ${u.lastName}`,
                  subLabel: u.email,
                }))}
              />
            )}
          />
          {errors.registeredById ? (
            <p className="text-sm text-destructive">
              {errors.registeredById.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={mutation.isPending}
        >
          {t("createProduct.buttons.cancel")}
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? t("createProduct.buttons.creating")
            : t("createProduct.buttons.create")}
        </Button>
      </div>
    </form>
  );
}
