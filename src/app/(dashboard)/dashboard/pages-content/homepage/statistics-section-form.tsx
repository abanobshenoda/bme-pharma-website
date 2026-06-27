"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createStatisticsSection,
  updateStatisticsSection,
  createStatisticsItem,
  updateStatisticsItem,
  deleteStatisticsItem,
} from "@/actions/statistics-section-actions";
import type {
  StatisticsSection,
  StatisticsItem,
} from "@/generated/prisma/client";

interface StatisticsSectionWithItems extends StatisticsSection {
  items: StatisticsItem[];
}

interface StatisticsSectionFormProps {
  initialData: StatisticsSectionWithItems | null;
}

export function StatisticsSectionForm({
  initialData,
}: StatisticsSectionFormProps) {
  const { language } = useLanguage();
  const [data, setData] = useState<StatisticsSectionWithItems | null>(
    initialData,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Section State
  const [arabicHeader, setArabicHeader] = useState(
    initialData?.arabic_header || "",
  );
  const [englishHeader, setEnglishHeader] = useState(
    initialData?.english_header || "",
  );
  const [arabicDescription, setArabicDescription] = useState(
    initialData?.arabic_description || "",
  );
  const [englishDescription, setEnglishDescription] = useState(
    initialData?.english_description || "",
  );

  const handleSaveSection = async () => {
    setIsLoading(true);
    try {
      const payload = {
        arabic_header: arabicHeader,
        english_header: englishHeader,
        arabic_description: arabicDescription,
        english_description: englishDescription,
      };

      if (data) {
        const res = await updateStatisticsSection(data.id, payload);
        if (res.success && res.data) {
          setData({ ...res.data, items: data.items });
          toast.success("Section updated successfully");
        } else {
          toast.error("Failed to update section");
        }
      } else {
        const res = await createStatisticsSection(payload);
        if (res.success && res.data) {
          setData({ ...res.data, items: [] });
          toast.success("Section created successfully");
        } else {
          toast.error("Failed to create section");
        }
      }
    } catch (_error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!data) {
      toast.error("Please save the section first");
      return;
    }

    const newItem = {
      arabic_title: "عنوان جديد",
      english_title: "New Title",
      percentage: 50,
      color: "#3b82f6",
    };

    const res = await createStatisticsItem(data.id, newItem);
    if (res.success && res.data) {
      setData({ ...data, items: [...data.items, res.data] });
      toast.success("Item added successfully");
    } else {
      toast.error("Failed to add item");
    }
  };

  const handleUpdateItem = async (id: number, field: string, value: any) => {
    if (!data) return;

    // Optimistic update
    const updatedItems = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    setData({ ...data, items: updatedItems });

    // Debounce or just save on blur would be better, but for simplicity saving directly here
    // In a real app, you might want to debounce this
    const res = await updateStatisticsItem(id, { [field]: value });
    if (!res.success) {
      toast.error("Failed to update item");
      // Revert if failed (optional, simpler to just notify)
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!data) return;
    const res = await deleteStatisticsItem(id);
    if (res.success) {
      setData({ ...data, items: data.items.filter((item) => item.id !== id) });
      toast.success("Item deleted successfully");
    } else {
      toast.error("Failed to delete item");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section Config */}
        <div className="space-y-4 border p-4 rounded-lg">
          <h3 className="font-semibold">Section Content</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>English Header</Label>
              <Input
                value={englishHeader}
                onChange={(e) => setEnglishHeader(e.target.value)}
                placeholder="Our Achievements"
              />
            </div>
            <div className="space-y-2 dir-rtl">
              <Label>Arabic Header</Label>
              <Input
                value={arabicHeader}
                onChange={(e) => setArabicHeader(e.target.value)}
                placeholder="إنجازاتنا"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label>English Description</Label>
              <Textarea
                value={englishDescription}
                onChange={(e) => setEnglishDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2 dir-rtl">
              <Label>Arabic Description</Label>
              <Textarea
                value={arabicDescription}
                onChange={(e) => setArabicDescription(e.target.value)}
                rows={3}
                dir="rtl"
              />
            </div>
          </div>
          <Button onClick={handleSaveSection} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Section Details
          </Button>
        </div>

        {/* Items Config */}
        {data && (
          <div className="space-y-4 border p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Statistics Items</h3>
              <Button size="sm" onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {data.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>
                        {language === "ar"
                          ? item.arabic_title || "عنصر جديد"
                          : item.english_title || "New Item"}{" "}
                        - {item.percentage}%
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>English Title</Label>
                      <Input
                        value={item.english_title || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            "english_title",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2 dir-rtl">
                      <Label>Arabic Title</Label>
                      <Input
                        value={item.arabic_title || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            "arabic_title",
                            e.target.value,
                          )
                        }
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Percentage (0-100)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.percentage}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            "percentage",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color (Hex)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={item.color}
                          className="w-12 h-10 p-1 cursor-pointer"
                          onChange={(e) =>
                            handleUpdateItem(item.id, "color", e.target.value)
                          }
                        />
                        <Input
                          value={item.color}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "color", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No statistics items yet. Click &quot;Add Item&quot; to start.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
