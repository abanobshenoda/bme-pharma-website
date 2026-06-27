"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";
import Image from "next/image";

import {
  getAboutMainHeader,
  createAboutMainHeader,
  updateAboutMainHeader,
  getAboutVisionSection,
  createAboutVisionSection,
  createAboutVisionItem,
  updateAboutVisionItem,
  deleteAboutVisionItem,
  getAboutTeamSection,
  createAboutTeamSection,
  updateAboutTeamSection,
  createAboutTeamMember,
  updateAboutTeamMember,
  deleteAboutTeamMember,
  getAboutHeroesSection,
  createAboutHeroesSection,
  updateAboutHeroesSection,
  createAboutHeroItem,
  updateAboutHeroItem,
  deleteAboutHeroItem,
} from "@/actions/about-page-actions";

import type {
  AboutMainHeader,
  AboutVisionSection,
  AboutVisionItem,
  AboutTeamSection,
  AboutTeamMember,
  AboutHeroesSection,
  AboutHeroItem,
} from "@/generated/prisma/client";

// ── Types ──

type VisionSectionWithItems = AboutVisionSection & {
  items: AboutVisionItem[];
};
type TeamSectionWithItems = AboutTeamSection & {
  items: AboutTeamMember[];
};
type HeroesSectionWithItems = AboutHeroesSection & {
  items: AboutHeroItem[];
};

const ICON_OPTIONS = [
  "Award",
  "Globe",
  "Users",
  "Headset",
  "Heart",
  "Shield",
  "Star",
  "Target",
  "Zap",
  "Clock",
  "CheckCircle",
  "Lightbulb",
  "TrendingUp",
  "Package",
  "Truck",
  "Eye",
  "Compass",
  "Rocket",
  "Flame",
  "BookOpen",
];

export default function AboutUsContent() {
  // ── State ──
  const [isLoading, setIsLoading] = useState(true);

  // Main Header
  const [mainHeader, setMainHeader] = useState<AboutMainHeader | null>(null);
  const [editHeader, setEditHeader] = useState({
    arabic_header: "",
    english_header: "",
    arabic_description: "",
    english_description: "",
  });
  const [headerSaving, setHeaderSaving] = useState(false);

  // Vision
  const [visionSection, setVisionSection] =
    useState<VisionSectionWithItems | null>(null);
  const [visionSaving, setVisionSaving] = useState(false);

  // Team
  const [teamSection, setTeamSection] = useState<TeamSectionWithItems | null>(
    null,
  );
  const [teamSaving, setTeamSaving] = useState(false);

  // Heroes
  const [heroesSection, setHeroesSection] =
    useState<HeroesSectionWithItems | null>(null);
  const [heroesSaving, setHeroesSaving] = useState(false);

  // ── Data Fetching ──
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [headerRes, visionRes, teamRes, heroesRes] = await Promise.all([
        getAboutMainHeader(),
        getAboutVisionSection(),
        getAboutTeamSection(),
        getAboutHeroesSection(),
      ]);

      if (!mounted) return;

      if (headerRes.success && headerRes.data) {
        setMainHeader(headerRes.data);
        setEditHeader({
          arabic_header: headerRes.data.arabic_header || "",
          english_header: headerRes.data.english_header || "",
          arabic_description: headerRes.data.arabic_description || "",
          english_description: headerRes.data.english_description || "",
        });
      }

      if (visionRes.success && visionRes.data) {
        setVisionSection(visionRes.data);
      }

      if (teamRes.success && teamRes.data) {
        setTeamSection(teamRes.data);
      }

      if (heroesRes.success && heroesRes.data) {
        setHeroesSection(heroesRes.data);
      }

      setIsLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Main Header Handlers ──

  const handleSaveHeader = async () => {
    setHeaderSaving(true);
    try {
      if (mainHeader) {
        const res = await updateAboutMainHeader(mainHeader.id, editHeader);
        if (res.success && res.data) {
          setMainHeader(res.data);
          toast.success("Header saved successfully");
        } else {
          toast.error("Failed to save header");
        }
      } else {
        const res = await createAboutMainHeader(editHeader);
        if (res.success && res.data) {
          setMainHeader(res.data);
          toast.success("Header created successfully");
        } else {
          toast.error("Failed to create header");
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setHeaderSaving(false);
    }
  };

  // ── Vision Handlers ──

  const handleInitVision = async () => {
    const res = await createAboutVisionSection();
    if (res.success && res.data) {
      setVisionSection(res.data);
      toast.success("Vision section created");
    } else {
      toast.error("Failed to create vision section");
    }
  };

  const handleAddVisionItem = async () => {
    if (!visionSection) return;
    setVisionSaving(true);
    const res = await createAboutVisionItem(visionSection.id, {
      icon: "Lightbulb",
      arabic_title: "",
      english_title: "New Item",
      arabic_description: "",
      english_description: "",
    });
    if (res.success && res.data) {
      setVisionSection({
        ...visionSection,
        items: [...visionSection.items, res.data],
      });
      toast.success("Vision item added");
    } else {
      toast.error("Failed to add vision item");
    }
    setVisionSaving(false);
  };

  const handleUpdateVisionItem = async (
    id: number,
    field: string,
    value: string,
  ) => {
    if (!visionSection) return;
    // Optimistic
    setVisionSection({
      ...visionSection,
      items: visionSection.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
    const res = await updateAboutVisionItem(id, { [field]: value });
    if (!res.success) toast.error("Failed to update vision item");
  };

  const handleDeleteVisionItem = async (id: number) => {
    if (!visionSection) return;
    const res = await deleteAboutVisionItem(id);
    if (res.success) {
      setVisionSection({
        ...visionSection,
        items: visionSection.items.filter((i) => i.id !== id),
      });
      toast.success("Vision item deleted");
    } else {
      toast.error("Failed to delete vision item");
    }
  };

  // ── Team Handlers ──

  const handleInitTeam = async () => {
    const res = await createAboutTeamSection();
    if (res.success && res.data) {
      setTeamSection(res.data);
      toast.success("Team section created");
    } else {
      toast.error("Failed to create team section");
    }
  };

  const handleAddTeamMember = async () => {
    if (!teamSection) return;
    setTeamSaving(true);
    const res = await createAboutTeamMember(teamSection.id, {
      image: "",
      arabic_name: "",
      english_name: "New Member",
      arabic_title: "",
      english_title: "",
    });
    if (res.success && res.data) {
      setTeamSection({
        ...teamSection,
        items: [...teamSection.items, res.data],
      });
      toast.success("Team member added");
    } else {
      toast.error("Failed to add team member");
    }
    setTeamSaving(false);
  };

  const handleUpdateTeamMember = async (
    id: number,
    field: string,
    value: string,
  ) => {
    if (!teamSection) return;
    setTeamSection({
      ...teamSection,
      items: teamSection.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
    const res = await updateAboutTeamMember(id, { [field]: value });
    if (!res.success) toast.error("Failed to update team member");
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (!teamSection) return;
    const res = await deleteAboutTeamMember(id);
    if (res.success) {
      setTeamSection({
        ...teamSection,
        items: teamSection.items.filter((i) => i.id !== id),
      });
      toast.success("Team member deleted");
    } else {
      toast.error("Failed to delete team member");
    }
  };

  // ── Heroes Handlers ──

  const handleInitHeroes = async () => {
    const res = await createAboutHeroesSection();
    if (res.success && res.data) {
      setHeroesSection(res.data);
      toast.success("Heroes section created");
    } else {
      toast.error("Failed to create heroes section");
    }
  };

  const handleAddHeroItem = async () => {
    if (!heroesSection) return;
    setHeroesSaving(true);
    const res = await createAboutHeroItem(heroesSection.id, {
      image: "",
      arabic_name: "",
      english_name: "New Hero",
      arabic_title: "",
      english_title: "",
    });
    if (res.success && res.data) {
      setHeroesSection({
        ...heroesSection,
        items: [...heroesSection.items, res.data],
      });
      toast.success("Hero added");
    } else {
      toast.error("Failed to add hero");
    }
    setHeroesSaving(false);
  };

  const handleUpdateHeroItem = async (
    id: number,
    field: string,
    value: string,
  ) => {
    if (!heroesSection) return;
    setHeroesSection({
      ...heroesSection,
      items: heroesSection.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
    const res = await updateAboutHeroItem(id, { [field]: value });
    if (!res.success) toast.error("Failed to update hero");
  };

  const handleDeleteHeroItem = async (id: number) => {
    if (!heroesSection) return;
    const res = await deleteAboutHeroItem(id);
    if (res.success) {
      setHeroesSection({
        ...heroesSection,
        items: heroesSection.items.filter((i) => i.id !== id),
      });
      toast.success("Hero deleted");
    } else {
      toast.error("Failed to delete hero");
    }
  };

  // ── Loading State ──

  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h3 className="text-lg font-medium">About Us</h3>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">About Us</h3>
        <p className="text-sm text-muted-foreground">
          Manage content for the About Us page.
        </p>
      </div>
      <Separator />

      {/* ═══════ 1. Main Header Section ═══════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Main Header Section</CardTitle>
            <Button
              onClick={handleSaveHeader}
              className="gap-2"
              disabled={headerSaving}
            >
              {headerSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Header
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>English Header</Label>
              <Input
                value={editHeader.english_header}
                onChange={(e) =>
                  setEditHeader({
                    ...editHeader,
                    english_header: e.target.value,
                  })
                }
                placeholder="About Us"
              />
            </div>
            <div className="space-y-2">
              <Label>Arabic Header</Label>
              <Input
                dir="rtl"
                value={editHeader.arabic_header}
                onChange={(e) =>
                  setEditHeader({
                    ...editHeader,
                    arabic_header: e.target.value,
                  })
                }
                placeholder="من نحن"
              />
            </div>
            <div className="space-y-2">
              <Label>English Description</Label>
              <Textarea
                value={editHeader.english_description}
                onChange={(e) =>
                  setEditHeader({
                    ...editHeader,
                    english_description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Arabic Description</Label>
              <Textarea
                dir="rtl"
                value={editHeader.arabic_description}
                onChange={(e) =>
                  setEditHeader({
                    ...editHeader,
                    arabic_description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* ═══════ 2. Our Vision Section ═══════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Our Vision Section</CardTitle>
            {visionSection ? (
              <Button
                size="sm"
                onClick={handleAddVisionItem}
                disabled={visionSaving}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            ) : (
              <Button size="sm" onClick={handleInitVision}>
                Initialize Section
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!visionSection && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Section not created yet. Click &quot;Initialize Section&quot; to
              start.
            </p>
          )}
          {visionSection?.items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {item.english_title || "Untitled"} — {item.icon || "No icon"}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteVisionItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={item.icon || "Lightbulb"}
                    onValueChange={(val) =>
                      handleUpdateVisionItem(item.id, "icon", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div />
                <div className="space-y-2">
                  <Label>English Title</Label>
                  <Input
                    value={item.english_title || ""}
                    onChange={(e) =>
                      handleUpdateVisionItem(
                        item.id,
                        "english_title",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arabic Title</Label>
                  <Input
                    dir="rtl"
                    value={item.arabic_title || ""}
                    onChange={(e) =>
                      handleUpdateVisionItem(
                        item.id,
                        "arabic_title",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>English Description</Label>
                  <Textarea
                    value={item.english_description || ""}
                    onChange={(e) =>
                      handleUpdateVisionItem(
                        item.id,
                        "english_description",
                        e.target.value,
                      )
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arabic Description</Label>
                  <Textarea
                    dir="rtl"
                    value={item.arabic_description || ""}
                    onChange={(e) =>
                      handleUpdateVisionItem(
                        item.id,
                        "arabic_description",
                        e.target.value,
                      )
                    }
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          {visionSection && visionSection.items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No vision items yet. Click &quot;Add Item&quot; to start.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* ═══════ 3. Our Team Section ═══════ */}
      <PersonSectionCard
        key={`team-${teamSection?.id ?? "init"}`}
        title="Our Team Section"
        section={teamSection}
        saving={teamSaving}
        onInit={handleInitTeam}
        onAdd={handleAddTeamMember}
        onUpdate={handleUpdateTeamMember}
        onDelete={handleDeleteTeamMember}
        onSaveHeader={async (payload) => {
          if (!teamSection) return;
          const res = await updateAboutTeamSection(teamSection.id, payload);
          if (res.success && res.data) {
            setTeamSection(res.data);
            toast.success("Team header saved");
          } else {
            toast.error("Failed to save team header");
          }
        }}
      />

      <Separator className="my-8" />

      {/* ═══════ 4. Our Heroes Section ═══════ */}
      <PersonSectionCard
        key={`heroes-${heroesSection?.id ?? "init"}`}
        title="Our Heroes Section"
        section={heroesSection}
        saving={heroesSaving}
        onInit={handleInitHeroes}
        onAdd={handleAddHeroItem}
        onUpdate={handleUpdateHeroItem}
        onDelete={handleDeleteHeroItem}
        onSaveHeader={async (payload) => {
          if (!heroesSection) return;
          const res = await updateAboutHeroesSection(heroesSection.id, payload);
          if (res.success && res.data) {
            setHeroesSection(res.data);
            toast.success("Heroes header saved");
          } else {
            toast.error("Failed to save heroes header");
          }
        }}
      />

      <div className="h-10" />
    </div>
  );
}

// ── Reusable Person Section Card (Team & Heroes share the same shape) ──

type PersonItem = {
  id: number;
  image: string | null;
  arabic_name: string | null;
  english_name: string | null;
  arabic_title: string | null;
  english_title: string | null;
};

type SectionHeaderPayload = {
  arabic_header?: string | null;
  english_header?: string | null;
  arabic_description?: string | null;
  english_description?: string | null;
};

type PersonSectionCardProps = {
  title: string;
  section: {
    id: number;
    arabic_header?: string | null;
    english_header?: string | null;
    arabic_description?: string | null;
    english_description?: string | null;
    items: PersonItem[];
  } | null;
  saving: boolean;
  onInit: () => Promise<void>;
  onAdd: () => Promise<void>;
  onUpdate: (id: number, field: string, value: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onSaveHeader: (payload: SectionHeaderPayload) => Promise<void>;
};

const PersonSectionCard = ({
  title,
  section,
  saving,
  onInit,
  onAdd,
  onUpdate,
  onDelete,
  onSaveHeader,
}: PersonSectionCardProps) => {
  const [editHeader, setEditHeader] = useState({
    arabic_header: section?.arabic_header || "",
    english_header: section?.english_header || "",
    arabic_description: section?.arabic_description || "",
    english_description: section?.english_description || "",
  });
  const [headerSaving, setHeaderSaving] = useState(false);

  const handleSaveHeader = async () => {
    setHeaderSaving(true);
    await onSaveHeader(editHeader);
    setHeaderSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {section ? (
            <Button size="sm" onClick={onAdd} disabled={saving}>
              <Plus className="mr-2 h-4 w-4" /> Add Person
            </Button>
          ) : (
            <Button size="sm" onClick={onInit}>
              Initialize Section
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!section && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Section not created yet. Click &quot;Initialize Section&quot; to
            start.
          </p>
        )}

        {/* Section Header & Description */}
        {section && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-muted-foreground">
                Section Header & Description
              </span>
              <Button
                size="sm"
                onClick={handleSaveHeader}
                disabled={headerSaving}
                className="gap-2"
              >
                {headerSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Header
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>English Header</Label>
                <Input
                  value={editHeader.english_header}
                  onChange={(e) =>
                    setEditHeader({
                      ...editHeader,
                      english_header: e.target.value,
                    })
                  }
                  placeholder="Our Team"
                />
              </div>
              <div className="space-y-2">
                <Label>Arabic Header</Label>
                <Input
                  dir="rtl"
                  value={editHeader.arabic_header}
                  onChange={(e) =>
                    setEditHeader({
                      ...editHeader,
                      arabic_header: e.target.value,
                    })
                  }
                  placeholder="فريقنا"
                />
              </div>
              <div className="space-y-2">
                <Label>English Description</Label>
                <Textarea
                  value={editHeader.english_description}
                  onChange={(e) =>
                    setEditHeader({
                      ...editHeader,
                      english_description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Arabic Description</Label>
                <Textarea
                  dir="rtl"
                  value={editHeader.arabic_description}
                  onChange={(e) =>
                    setEditHeader({
                      ...editHeader,
                      arabic_description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}
        {section?.items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.image && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                    <Image
                      src={item.image}
                      alt={item.english_name || "Person"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="font-medium text-sm">
                  {item.english_name || "Unnamed"}
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Photo</Label>
              <CloudinaryUploadWidget
                value={item.image || ""}
                onUpload={(url) => onUpdate(item.id, "image", url)}
                onRemove={() => onUpdate(item.id, "image", "")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>English Name</Label>
                <Input
                  value={item.english_name || ""}
                  onChange={(e) =>
                    onUpdate(item.id, "english_name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Arabic Name</Label>
                <Input
                  dir="rtl"
                  value={item.arabic_name || ""}
                  onChange={(e) =>
                    onUpdate(item.id, "arabic_name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>English Title / Role</Label>
                <Input
                  value={item.english_title || ""}
                  onChange={(e) =>
                    onUpdate(item.id, "english_title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Arabic Title / Role</Label>
                <Input
                  dir="rtl"
                  value={item.arabic_title || ""}
                  onChange={(e) =>
                    onUpdate(item.id, "arabic_title", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
        {section && section.items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items yet. Click &quot;Add Person&quot; to start.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
