"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";

export default function AdminHaircutStylesPage() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isTrending: false,
  });

  useEffect(() => {
    loadStyles();
  }, []);

  const loadStyles = async () => {
    try {
      const data = await api.getHaircutStyles();
      setStyles(data);
    } catch (error) {
      console.error("Failed to load styles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStyle) {
        await api.updateHaircutStyle(editingStyle._id, formData);
      } else {
        await api.createHaircutStyle(formData);
      }
      setShowDialog(false);
      setEditingStyle(null);
      setFormData({ name: "", description: "", image: "", isTrending: false });
      loadStyles();
    } catch (error) {
      console.error("Failed to save style:", error);
    }
  };

  const handleEdit = (style) => {
    setEditingStyle(style);
    setFormData({
      name: style.name,
      description: style.description || "",
      image: style.image || "",
      isTrending: style.isTrending || false,
    });
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingStyle(null);
    setFormData({ name: "", description: "", image: "", isTrending: false });
    setShowDialog(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading styles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Haircut Styles</h1>
        <p className="text-muted-foreground">
          Manage trending haircut styles and images
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Haircut Styles</CardTitle>
              <CardDescription>
                Create and manage trending haircut styles
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              Add New Style
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Trending</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style) => (
                <TableRow key={style._id}>
                  <TableCell>
                    {style.image ? (
                      <img
                        src={style.image}
                        alt={style.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <span className="text-2xl">✂️</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{style.name}</TableCell>
                  <TableCell>
                    {style.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {style.description}
                      </p>
                    ) : (
                      <span className="text-muted-foreground">No description</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      style.isTrending 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {style.isTrending ? 'Trending' : 'Not Trending'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(style)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {styles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No haircut styles found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStyle ? 'Edit Haircut Style' : 'Add New Haircut Style'}
            </DialogTitle>
            <DialogDescription>
              {editingStyle ? 'Update the haircut style information' : 'Create a new haircut style'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter style name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter style description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="Enter image URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isTrending">Trending Status</Label>
              <Select
                id="isTrending"
                value={formData.isTrending ? 'true' : 'false'}
                onChange={(e) => setFormData(prev => ({ ...prev, isTrending: e.target.value === 'true' }))}
              >
                <option value="false">Not Trending</option>
                <option value="true">Trending</option>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingStyle ? 'Update Style' : 'Create Style'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
