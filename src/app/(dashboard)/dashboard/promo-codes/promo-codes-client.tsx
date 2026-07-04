"use client";

import { useState } from "react";
import {
  getPromoCodes,
  createPromoCode,
  togglePromoCodeStatus,
  deletePromoCode,
  PromoCodeInput,
} from "@/actions/promo-code-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus,
  Tag,
  Trash2,
  BarChart3,
  Calendar,
  DollarSign,
  Percent,
  Shuffle,
} from "lucide-react";

type PromoCodeRow = NonNullable<Awaited<ReturnType<typeof getPromoCodes>>["data"]>[number];

interface PromoCodesClientProps {
  initialCodes: NonNullable<Awaited<ReturnType<typeof getPromoCodes>>["data"]>;
}

const emptyForm: PromoCodeInput = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: 10,
  currency: "EGP",
  isActive: true,
  usageLimit: null,
  minOrderValue: null,
  expiresAt: null,
  description: null,
};

export function PromoCodesClient({ initialCodes }: PromoCodesClientProps) {
  const [codes, setCodes] =
    useState<NonNullable<Awaited<ReturnType<typeof getPromoCodes>>["data"]>>(
      initialCodes
    );
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PromoCodeInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  const refreshCodes = async () => {
    const res = await getPromoCodes();
    if (res.success && res.data) setCodes(res.data);
  };

  const handleCreate = async () => {
    if (!form.code.trim()) {
      toast.error("Promo code name is required.");
      return;
    }
    if (form.discountValue <= 0) {
      toast.error("Discount value must be greater than 0.");
      return;
    }
    if (form.discountType === "PERCENTAGE" && form.discountValue > 100) {
      toast.error("Percentage discount cannot exceed 100%.");
      return;
    }

    setSaving(true);
    const res = await createPromoCode(form);
    setSaving(false);

    if (res.success) {
      toast.success("Promo code created!");
      setOpen(false);
      setForm(emptyForm);
      await refreshCodes();
    } else {
      toast.error(res.error || "Failed to create promo code.");
    }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    await togglePromoCodeStatus(id, isActive);
    await refreshCodes();
    toast.success(isActive ? "Promo code activated." : "Promo code deactivated.");
  };

  const handleDelete = async (id: number) => {
    const res = await deletePromoCode(id);
    if (res.success) {
      toast.success("Promo code deleted.");
      await refreshCodes();
    } else {
      toast.error(res.error || "Failed to delete.");
    }
  };

  const formatDiscount = (code: PromoCodeRow) => {
    if (code.discountType === "PERCENTAGE") {
      return `${code.discountValue}%`;
    }
    const sym = code.currency === "EGP" ? "E£" : "$";
    return `${sym}${code.discountValue}`;
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const generateCode = () => {
    const prefixes = ["SAVE", "DEAL", "GIFT", "OFF", "PROMO", "VIP", "SALE", "WIN"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars like 0/O, 1/I
    const suffix = Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    setForm((f) => ({ ...f, code: `${prefix}-${suffix}` }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promo Codes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage discount codes for your customers.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Create Promo Code
              </DialogTitle>
              <DialogDescription>
                Set up a discount code for your customers to use at checkout.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Code */}
              <div className="space-y-1.5">
                <Label htmlFor="code">
                  Code <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="e.g. SAVE10, EID2025"
                    value={form.code}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    className="font-mono uppercase flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateCode}
                    title="Generate random code"
                    className="shrink-0"
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Type your own or click <Shuffle className="inline w-3 h-3 mx-0.5" /> to generate a random one.
                </p>
              </div>

              {/* Discount Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Discount Type</Label>
                  <Select
                    value={form.discountType}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        discountType: v as "PERCENTAGE" | "FIXED",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">
                        <span className="flex items-center gap-2">
                          <Percent className="w-3.5 h-3.5" />
                          Percentage (%)
                        </span>
                      </SelectItem>
                      <SelectItem value="FIXED">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5" />
                          Fixed Amount
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="discountValue">
                    {form.discountType === "PERCENTAGE"
                      ? "Percentage (%)"
                      : "Amount"}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min={0}
                    max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                    step={form.discountType === "PERCENTAGE" ? 1 : 0.01}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        discountValue: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Currency (only for FIXED) */}
              {form.discountType === "FIXED" && (
                <div className="space-y-1.5">
                  <Label>Currency (for fixed discount)</Label>
                  <Select
                    value={form.currency}
                    onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">EGP — Egyptian Pound (E£)</SelectItem>
                      <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Will be converted automatically if customer uses the other currency.
                  </p>
                </div>
              )}

              {/* Usage Limit + Min Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    min={1}
                    placeholder="Unlimited"
                    value={form.usageLimit ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        usageLimit: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for unlimited uses.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minOrderValue">Min. Order Value</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="No minimum"
                    value={form.minOrderValue ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        minOrderValue: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    In the selected currency.
                  </p>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-1.5">
                <Label htmlFor="expiresAt">Expiry Date (optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={form.expiresAt ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      expiresAt: e.target.value || null,
                    }))
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">Internal Note (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g. Eid Al-Adha campaign 2025"
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value || null }))
                  }
                  rows={2}
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">
                    Inactive codes cannot be applied at checkout.
                  </p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create Code"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Codes",
            value: codes.length,
            icon: Tag,
            color: "text-blue-500",
          },
          {
            label: "Active",
            value: codes.filter((c) => c.isActive && !isExpired(c.expiresAt as Date | null)).length,
            icon: BarChart3,
            color: "text-green-500",
          },
          {
            label: "Expired",
            value: codes.filter((c) => isExpired(c.expiresAt as Date | null)).length,
            icon: Calendar,
            color: "text-amber-500",
          },
          {
            label: "Total Uses",
            value: codes.reduce((s, c) => s + c.usageCount, 0),
            icon: BarChart3,
            color: "text-purple-500",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
              </div>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">All Promo Codes</CardTitle>
          <CardDescription>
            {codes.length === 0
              ? "No promo codes yet. Create your first one!"
              : `${codes.length} code${codes.length !== 1 ? "s" : ""} total`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {codes.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">No promo codes yet</p>
              <p className="text-sm mt-1">Click &quot;New Promo Code&quot; to create one.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => {
                  const expired = isExpired(code.expiresAt as Date | null);
                  return (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div>
                          <code className="font-mono font-bold text-sm bg-muted px-2 py-0.5 rounded">
                            {code.code}
                          </code>
                          {code.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {code.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {code.discountType === "PERCENTAGE" ? (
                            <Percent className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <DollarSign className="w-3.5 h-3.5 text-green-500" />
                          )}
                          <span className="font-semibold">
                            {formatDiscount(code)}
                          </span>
                          {code.discountType === "FIXED" && (
                            <span className="text-xs text-muted-foreground">
                              ({code.currency})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {code.usageCount}
                          {code.usageLimit !== null
                            ? ` / ${code.usageLimit}`
                            : " / ∞"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {code.minOrderValue
                          ? `${code.currency === "EGP" ? "E£" : "$"}${code.minOrderValue}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {code.expiresAt ? (
                          <span
                            className={`text-xs ${expired ? "text-destructive font-medium" : "text-muted-foreground"}`}
                          >
                            {expired && "⚠ "}
                            {new Date(code.expiresAt).toLocaleDateString("en-EG")}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Never
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={code.isActive && !expired}
                            disabled={expired}
                            onCheckedChange={(v) => handleToggle(code.id, v)}
                          />
                          <Badge
                            variant={
                              expired
                                ? "destructive"
                                : code.isActive
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {expired
                              ? "Expired"
                              : code.isActive
                                ? "Active"
                                : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Promo Code?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <code className="font-mono font-bold">
                                  {code.code}
                                </code>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(code.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
