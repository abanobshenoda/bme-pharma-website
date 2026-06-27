"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Loader2,
  MapPin,
  Trash2,
  Mail,
  MailOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

import {
  getContactUsSection,
  createContactUsSection,
  updateContactUsSection,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "@/actions/contact-us-actions";

import type {
  ContactUsSection,
  ContactMessage,
} from "@/generated/prisma/client";

export default function ContactUsContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<ContactUsSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [editData, setEditData] = useState({
    arabic_header: "",
    english_header: "",
    arabic_description: "",
    english_description: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [sectionRes, messagesRes] = await Promise.all([
        getContactUsSection(),
        getContactMessages(),
      ]);

      if (!mounted) return;

      if (sectionRes.success && sectionRes.data) {
        setSection(sectionRes.data);
        setEditData({
          arabic_header: sectionRes.data.arabic_header || "",
          english_header: sectionRes.data.english_header || "",
          arabic_description: sectionRes.data.arabic_description || "",
          english_description: sectionRes.data.english_description || "",
          latitude: sectionRes.data.latitude || "",
          longitude: sectionRes.data.longitude || "",
        });
      }

      if (messagesRes.success && messagesRes.data) {
        setMessages(messagesRes.data);
      }

      setIsLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (section) {
        const res = await updateContactUsSection(section.id, editData);
        if (res.success && res.data) {
          setSection(res.data);
          toast.success("Contact Us section saved successfully");
        } else {
          toast.error("Failed to save");
        }
      } else {
        const res = await createContactUsSection(editData);
        if (res.success && res.data) {
          setSection(res.data);
          toast.success("Contact Us section created successfully");
        } else {
          toast.error("Failed to create");
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setEditData({
          ...editData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
        toast.success("Location captured from GPS");
      },
      (error) => {
        toast.error(`Failed to get location: ${error.message}`);
      },
    );
  };

  const handleToggleMessage = async (msg: ContactMessage) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(msg.id);

    if (!msg.read) {
      const res = await markMessageAsRead(msg.id);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
        );
      }
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const res = await deleteContactMessage(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Message deleted");
    } else {
      toast.error("Failed to delete message");
    }
  };

  const mapSrc =
    editData.latitude && editData.longitude
      ? `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${editData.longitude}!3d${editData.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg`
      : null;

  const unreadCount = messages.filter((m) => !m.read).length;

  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <div>
          <h3 className="text-lg font-medium">Contact Us</h3>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Contact Us</h3>
        <p className="text-sm text-muted-foreground">
          Manage the Contact Us page header, description, map location, and view
          incoming messages.
        </p>
      </div>
      <Separator />

      {/* ═══════ Header & Description ═══════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contact Us Section</CardTitle>
            <Button onClick={handleSave} className="gap-2" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>English Header</Label>
              <Input
                value={editData.english_header}
                onChange={(e) =>
                  setEditData({ ...editData, english_header: e.target.value })
                }
                placeholder="Contact Us"
              />
            </div>
            <div className="space-y-2">
              <Label>Arabic Header</Label>
              <Input
                dir="rtl"
                value={editData.arabic_header}
                onChange={(e) =>
                  setEditData({ ...editData, arabic_header: e.target.value })
                }
                placeholder="اتصل بنا"
              />
            </div>
            <div className="space-y-2">
              <Label>English Description</Label>
              <Textarea
                value={editData.english_description}
                onChange={(e) =>
                  setEditData({
                    ...editData,
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
                value={editData.arabic_description}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    arabic_description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* ═══════ Location ═══════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Map Location</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                className="gap-2"
              >
                <MapPin className="h-4 w-4" />
                Get from GPS
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  value={editData.latitude}
                  onChange={(e) =>
                    setEditData({ ...editData, latitude: e.target.value })
                  }
                  placeholder="30.0596"
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  value={editData.longitude}
                  onChange={(e) =>
                    setEditData({ ...editData, longitude: e.target.value })
                  }
                  placeholder="31.2235"
                />
              </div>
            </div>

            {mapSrc ? (
              <div className="h-64 w-full bg-muted rounded-lg overflow-hidden border relative">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map Preview"
                />
              </div>
            ) : (
              <div className="h-64 w-full bg-muted rounded-lg border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  Enter coordinates or click &quot;Get from GPS&quot; to preview
                  the map.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 border p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Office address, phone, email, and working
              hours are managed from the <strong>Company Info</strong> section
              in Page Content.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* ═══════ Incoming Messages ═══════ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Incoming Messages</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} new</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {messages.length} total
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages yet. Messages from the &quot;Get in Touch&quot; form
              will appear here.
            </p>
          )}

          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`border rounded-lg transition-colors ${
                  !msg.read ? "bg-primary/5 border-primary/20" : "bg-card"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleMessage(msg)}
                  className="w-full p-4 flex items-center justify-between text-left"
                  aria-label={`Toggle message from ${msg.name}`}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {msg.read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium text-sm truncate ${
                            !msg.read ? "text-primary" : ""
                          }`}
                        >
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          &lt;{msg.email}&gt;
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 space-y-3 border-t">
                    <div className="pt-3">
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="h-10" />
    </div>
  );
}
