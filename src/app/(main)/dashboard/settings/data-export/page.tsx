"use client";

import { useState } from "react";

import {
  Download,
  FileArchive,
  FileJson,
  FileSpreadsheet,
  FileText,
  HardDrive,
  History,
  Key,
  Lock,
  RefreshCw,
  Shield,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ExportFormat = "json" | "csv" | "xml";
type ExportStatus = "pending" | "processing" | "completed" | "failed";

interface ExportJob {
  id: string;
  name: string;
  format: ExportFormat;
  entities: string[];
  status: ExportStatus;
  progress: number;
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  downloadUrl?: string;
}

interface Backup {
  id: string;
  name: string;
  createdAt: string;
  size: string;
  type: "automatic" | "manual";
  status: "completed" | "failed";
  entities: string[];
}

const mockExportJobs: ExportJob[] = [
  {
    id: "1",
    name: "Full Data Export - Q4 2024",
    format: "json",
    entities: ["users", "projects", "tasks", "comments", "attachments"],
    status: "completed",
    progress: 100,
    createdAt: "2024-12-15T10:30:00Z",
    completedAt: "2024-12-15T10:45:00Z",
    fileSize: "2.4 GB",
    downloadUrl: "#",
  },
  {
    id: "2",
    name: "User Data Export",
    format: "csv",
    entities: ["users"],
    status: "processing",
    progress: 65,
    createdAt: "2024-12-20T14:20:00Z",
  },
  {
    id: "3",
    name: "Project Analytics",
    format: "xml",
    entities: ["projects", "tasks"],
    status: "failed",
    progress: 30,
    createdAt: "2024-12-18T09:15:00Z",
  },
];

const mockBackups: Backup[] = [
  {
    id: "1",
    name: "Daily Backup - Dec 20",
    createdAt: "2024-12-20T02:00:00Z",
    size: "5.2 GB",
    type: "automatic",
    status: "completed",
    entities: ["users", "projects", "tasks", "comments", "attachments", "settings"],
  },
  {
    id: "2",
    name: "Weekly Backup - Dec 15",
    createdAt: "2024-12-15T02:00:00Z",
    size: "4.8 GB",
    type: "automatic",
    status: "completed",
    entities: ["users", "projects", "tasks", "comments", "attachments", "settings"],
  },
  {
    id: "3",
    name: "Pre-Migration Backup",
    createdAt: "2024-12-10T16:30:00Z",
    size: "4.5 GB",
    type: "manual",
    status: "completed",
    entities: ["users", "projects", "tasks", "comments", "attachments", "settings"],
  },
];

const availableEntities = [
  { id: "users", label: "Users & Profiles", description: "User accounts, profiles, and preferences" },
  { id: "projects", label: "Projects", description: "Project data, settings, and metadata" },
  { id: "tasks", label: "Tasks & Issues", description: "Tasks, issues, and work items" },
  { id: "comments", label: "Comments", description: "Comments and discussions" },
  { id: "attachments", label: "Attachments", description: "Files and attachments" },
  { id: "settings", label: "Settings", description: "Workspace and system settings" },
];

export default function DataExportPage() {
  const [activeTab, setActiveTab] = useState("export");
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(mockExportJobs);
  const [backups] = useState<Backup[]>(mockBackups);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  // Export form state
  const [exportName, setExportName] = useState("");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [enableEncryption, setEnableEncryption] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState("");

  // Backup schedule state
  const [backupSchedule, setBackupSchedule] = useState("daily");
  const [backupRetention, setBackupRetention] = useState("30");
  const [enableEncryptionAtRest, setEnableEncryptionAtRest] = useState(true);

  const handleCreateExport = () => {
    const newExport: ExportJob = {
      id: String(Date.now()),
      name: exportName || `Export - ${new Date().toLocaleDateString()}`,
      format: exportFormat,
      entities: selectedEntities,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    setExportJobs([newExport, ...exportJobs]);
    setShowExportDialog(false);
    resetExportForm();

    // Simulate progress
    setTimeout(() => {
      setExportJobs((prev) =>
        prev.map((job) => (job.id === newExport.id ? { ...job, status: "processing", progress: 25 } : job)),
      );
    }, 1000);
  };

  const resetExportForm = () => {
    setExportName("");
    setExportFormat("json");
    setSelectedEntities([]);
    setEnableEncryption(false);
    setEncryptionPassword("");
  };

  const handleRestore = () => {
    if (!selectedBackup) return;
    // Simulate restore process
    setShowRestoreDialog(false);
    setSelectedBackup(null);
    // In real implementation, this would trigger a restore job
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "json":
        return <FileJson className="h-4 w-4" />;
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "xml":
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ExportStatus) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Data Export & Backup</h1>
        <p className="text-muted-foreground">Export your data and manage automated backups</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </TabsTrigger>
          <TabsTrigger value="backup">
            <HardDrive className="mr-2 h-4 w-4" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <History className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>
                Export your data in various formats. Large exports may take several minutes to complete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={() => setShowExportDialog(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Create Export
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Entities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFormatIcon(job.format)}
                          <span className="uppercase">{job.format}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {job.entities.slice(0, 3).map((entity) => (
                            <Badge key={entity} variant="outline" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                          {job.entities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.entities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>
                        {job.status === "processing" ? (
                          <div className="flex items-center gap-2">
                            <Progress value={job.progress} className="h-2 w-20" />
                            <span className="text-muted-foreground text-xs">{job.progress}%</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{job.fileSize || "-"}</TableCell>
                      <TableCell>
                        {job.status === "completed" && job.downloadUrl && (
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        )}
                        {job.status === "failed" && (
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>
                    View and restore from previous backups. Automatic backups are created based on your schedule.
                  </CardDescription>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entities</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell>
                        <Badge variant={backup.type === "automatic" ? "secondary" : "outline"}>{backup.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(backup.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        <Badge variant={backup.status === "completed" ? "default" : "destructive"}>
                          {backup.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {backup.entities.slice(0, 3).map((entity) => (
                            <Badge key={entity} variant="outline" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                          {backup.entities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{backup.entities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setShowRestoreDialog(true);
                            }}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restore
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup Schedule</CardTitle>
              <CardDescription>Configure automatic backup schedule and retention policy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-sm">How often automatic backups should be created</p>
              </div>

              <div className="space-y-2">
                <Label>Retention Period (days)</Label>
                <Input
                  type="number"
                  value={backupRetention}
                  onChange={(e) => setBackupRetention(e.target.value)}
                  min="1"
                  max="365"
                />
                <p className="text-muted-foreground text-sm">How long to keep backups before automatic deletion</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Encryption at Rest</Label>
                  <p className="text-muted-foreground text-sm">Encrypt backups using AES-256 encryption</p>
                </div>
                <Switch checked={enableEncryptionAtRest} onCheckedChange={setEnableEncryptionAtRest} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Schedule</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Data Requests</CardTitle>
              <CardDescription>Handle GDPR, CCPA, and other data compliance requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">GDPR Data Portability</p>
                    <p className="text-muted-foreground text-sm">
                      Export all user data in a machine-readable format for data portability requests
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Create Request
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Right to Erasure</p>
                    <p className="text-muted-foreground text-sm">
                      Permanently delete all user data in compliance with data protection regulations
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Process Request
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <FileArchive className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">Data Retention Report</p>
                    <p className="text-muted-foreground text-sm">
                      Generate a report showing data retention policies and compliance status
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Data Export</DialogTitle>
            <DialogDescription>Select the data entities and format for your export</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Name</Label>
              <Input
                placeholder="e.g., Q4 2024 Data Export"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      JSON
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                  <SelectItem value="xml">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      XML
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Entities to Export</Label>
              <div className="grid gap-3">
                {availableEntities.map((entity) => (
                  <div key={entity.id} className="flex items-start space-x-3 rounded-lg border p-3">
                    <Checkbox
                      id={entity.id}
                      checked={selectedEntities.includes(entity.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEntities([...selectedEntities, entity.id]);
                        } else {
                          setSelectedEntities(selectedEntities.filter((e) => e !== entity.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label htmlFor={entity.id} className="font-medium">
                        {entity.label}
                      </Label>
                      <p className="text-muted-foreground text-sm">{entity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Encryption</Label>
                  <p className="text-muted-foreground text-sm">Protect export with password-based encryption</p>
                </div>
                <Switch checked={enableEncryption} onCheckedChange={setEnableEncryption} />
              </div>

              {enableEncryption && (
                <div className="space-y-2">
                  <Label>Encryption Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter strong password"
                    value={encryptionPassword}
                    onChange={(e) => setEncryptionPassword(e.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">
                    <Key className="mr-1 inline h-3 w-3" />
                    Store this password securely. You'll need it to decrypt the export.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateExport}
              disabled={selectedEntities.length === 0 || (enableEncryption && !encryptionPassword)}
            >
              <Download className="mr-2 h-4 w-4" />
              Start Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Backup Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore from Backup</DialogTitle>
            <DialogDescription>
              This will restore your workspace to the state at the time of the backup. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedBackup && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="font-medium">{selectedBackup.name}</p>
                <p className="text-muted-foreground text-sm">
                  Created: {new Date(selectedBackup.createdAt).toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">Size: {selectedBackup.size}</p>
              </div>

              <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="font-medium text-destructive text-sm">Warning</p>
                <p className="text-muted-foreground text-sm">
                  Restoring will overwrite all current data with the backup data. Make sure to create a backup of your
                  current state before proceeding.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Confirm Restore</Label>
                <Textarea placeholder="Type 'RESTORE' to confirm" className="font-mono" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRestore}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
