"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Truck,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getShippingRules,
  createShippingRule,
  updateShippingRule,
  deleteShippingRule,
  type ShippingRuleInput,
} from "@/actions/shipping-actions";

type ShippingRule = {
  id: number;
  ruleType: string;
  minValue: number;
  maxValue: number | null;
  price: number;
  currency: string;
  arabic_label: string | null;
  english_label: string | null;
  isActive: boolean;
  sortOrder: number;
};

const EMPTY_FORM: ShippingRuleInput = {
  ruleType: "QUANTITY",
  minValue: 1,
  maxValue: null,
  price: 50,
  currency: "EGP",
  arabic_label: "",
  english_label: "",
  isActive: true,
  sortOrder: 0,
};

export default function ShippingRulesPage() {
  const [rules, setRules] = useState<ShippingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ShippingRuleInput>({ ...EMPTY_FORM });

  const loadRules = async () => {
    const res = await getShippingRules();
    if (res.success && res.data) {
      setRules(res.data as ShippingRule[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleEdit = (rule: ShippingRule) => {
    setEditingId(rule.id);
    setForm({
      ruleType: rule.ruleType as "QUANTITY" | "AMOUNT",
      minValue: rule.minValue,
      maxValue: rule.maxValue,
      price: rule.price,
      currency: rule.currency as "EGP" | "USD",
      arabic_label: rule.arabic_label || "",
      english_label: rule.english_label || "",
      isActive: rule.isActive,
      sortOrder: rule.sortOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleSubmit = async () => {
    if (form.minValue < 0 || form.price < 0) {
      toast.error("Values cannot be negative");
      return;
    }
    setIsSaving(true);
    const payload: ShippingRuleInput = {
      ...form,
      maxValue: form.maxValue || null,
      arabic_label: form.arabic_label || null,
      english_label: form.english_label || null,
    };

    const res = editingId
      ? await updateShippingRule(editingId, payload)
      : await createShippingRule(payload);

    if (res.success) {
      toast.success(editingId ? "Rule updated" : "Rule created");
      handleCancel();
      loadRules();
    } else {
      toast.error("Failed to save rule");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this shipping rule?")) return;
    const res = await deleteShippingRule(id);
    if (res.success) {
      toast.success("Rule deleted");
      setRules(rules.filter((r) => r.id !== id));
    } else {
      toast.error("Failed to delete rule");
    }
  };

  const handleToggleActive = async (rule: ShippingRule) => {
    const res = await updateShippingRule(rule.id, { isActive: !rule.isActive });
    if (res.success) {
      setRules(
        rules.map((r) =>
          r.id === rule.id ? { ...r, isActive: !r.isActive } : r,
        ),
      );
    } else {
      toast.error("Failed to update rule");
    }
  };

  // Group rules by currency for display
  const egpRules = rules.filter((r) => r.currency === "EGP");
  const usdRules = rules.filter((r) => r.currency === "USD");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const RuleCard = ({ rule }: { rule: ShippingRule }) => (
    <div
      className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity ${
        rule.isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={rule.ruleType === "QUANTITY" ? "secondary" : "outline"}>
            {rule.ruleType === "QUANTITY" ? "By Quantity" : "By Amount"}
          </Badge>
          <Badge variant={rule.currency === "EGP" ? "default" : "secondary"}>
            {rule.currency}
          </Badge>
          {!rule.isActive && (
            <Badge variant="destructive" className="text-[10px]">
              Inactive
            </Badge>
          )}
        </div>
        <p className="font-semibold mt-2 text-sm">
          {rule.ruleType === "QUANTITY" ? (
            <>
              {rule.minValue} — {rule.maxValue ?? "∞"} items →{" "}
              <span className="text-primary font-bold">
                {rule.price} {rule.currency}
              </span>
            </>
          ) : (
            <>
              {rule.minValue} — {rule.maxValue ?? "∞"} {rule.currency} (subtotal) →{" "}
              <span className="text-primary font-bold">
                {rule.price} {rule.currency}
              </span>
            </>
          )}
        </p>
        {(rule.english_label || rule.arabic_label) && (
          <p className="text-xs text-muted-foreground mt-1">
            {rule.english_label} / {rule.arabic_label}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={rule.isActive}
          onCheckedChange={() => handleToggleActive(rule)}
          aria-label="Toggle active"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(rule)}
          aria-label={`Edit shipping rule ${rule.id}`}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(rule.id)}
          aria-label={`Delete shipping rule ${rule.id}`}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Shipping Rules</h3>
        <p className="text-sm text-muted-foreground">
          Configure shipping fees based on cart quantity or order subtotal. Rules
          are evaluated in order — the last matching rule wins.
        </p>
      </div>
      <Separator />

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold mb-1">How shipping rules work:</p>
          <ul className="space-y-1 list-disc list-inside text-xs">
            <li>
              <strong>By Quantity</strong>: checks total number of items in cart
            </li>
            <li>
              <strong>By Amount</strong>: checks cart subtotal (after discounts)
            </li>
            <li>Rules are independent per currency (EGP / USD)</li>
            <li>
              When multiple rules match, the <strong>last</strong> one wins
              (sorted by Sort Order then Min Value)
            </li>
            <li>
              Set Max Value to blank (∞) for an open-ended upper tier
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form Section ── */}
        <Card className="lg:col-span-1 h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Rule" : "Add New Rule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency *</Label>
              <Select
                value={form.currency}
                onValueChange={(val: "EGP" | "USD") =>
                  setForm({ ...form, currency: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EGP">EGP (Egyptian Pound)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rule Type */}
            <div className="space-y-2">
              <Label>Rule Type *</Label>
              <Select
                value={form.ruleType}
                onValueChange={(val: "QUANTITY" | "AMOUNT") =>
                  setForm({ ...form, ruleType: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUANTITY">By Quantity (# of items)</SelectItem>
                  <SelectItem value="AMOUNT">By Amount (order subtotal)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {form.ruleType === "QUANTITY"
                  ? "Checks the total number of items in the cart."
                  : "Checks the cart subtotal after discounts."}
              </p>
            </div>

            {/* Min / Max Values */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>
                  Min {form.ruleType === "QUANTITY" ? "Items" : `(${form.currency})`} *
                </Label>
                <Input
                  type="number"
                  value={form.minValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Max {form.ruleType === "QUANTITY" ? "Items" : `(${form.currency})`}{" "}
                  <span className="text-muted-foreground text-[10px]">(blank=∞)</span>
                </Label>
                <Input
                  type="number"
                  value={form.maxValue ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxValue: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                  min={0}
                  placeholder="∞"
                />
              </div>
            </div>

            {/* Shipping Price */}
            <div className="space-y-2">
              <Label>Shipping Price ({form.currency}) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
                min={0}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 for free shipping
              </p>
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label>English Label</Label>
              <Input
                value={form.english_label || ""}
                onChange={(e) =>
                  setForm({ ...form, english_label: e.target.value })
                }
                placeholder="e.g. More than 2 items"
              />
            </div>
            <div className="space-y-2">
              <Label>Arabic Label</Label>
              <Input
                value={form.arabic_label || ""}
                onChange={(e) =>
                  setForm({ ...form, arabic_label: e.target.value })
                }
                dir="rtl"
                placeholder="مثال: أكثر من قطعتين"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower number = evaluated first
              </p>
            </div>

            {/* Active */}
            <div className="flex items-center gap-3 pt-1">
              <Checkbox
                id="isActive"
                checked={form.isActive ?? true}
                onCheckedChange={(checked: boolean) =>
                  setForm({ ...form, isActive: checked })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Edit2 className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {editingId ? "Update Rule" : "Create Rule"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Rules List ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* EGP Section */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              EGP Rules ({egpRules.length})
            </h4>
            {egpRules.length === 0 ? (
              <Card className="py-8 text-center text-muted-foreground text-sm">
                No EGP shipping rules yet. Add one using the form.
              </Card>
            ) : (
              <div className="space-y-3">
                {egpRules.map((rule) => (
                  <RuleCard key={rule.id} rule={rule} />
                ))}
              </div>
            )}
          </div>

          {/* USD Section */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              USD Rules ({usdRules.length})
            </h4>
            {usdRules.length === 0 ? (
              <Card className="py-8 text-center text-muted-foreground text-sm">
                No USD shipping rules yet. Add one using the form.
              </Card>
            ) : (
              <div className="space-y-3">
                {usdRules.map((rule) => (
                  <RuleCard key={rule.id} rule={rule} />
                ))}
              </div>
            )}
          </div>

          {rules.length === 0 && (
            <Card className="py-16 text-center">
              <Truck className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground text-sm">
                No shipping rules configured yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add rules to override the default flat shipping rate.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
