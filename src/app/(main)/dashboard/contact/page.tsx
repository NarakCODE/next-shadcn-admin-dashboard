"use client";

import { useState } from "react";

import { CheckCircle2, Clock, Mail, MapPin, Phone, Search, Send, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar: string;
  status: "active" | "inactive" | "lead";
  lastContact: string;
  messages: number;
  address: string;
  notes: string;
};

const contacts: Contact[] = [
  {
    id: "c-1",
    name: "James Johnson",
    email: "james.johnson@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    role: "CEO",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    status: "active",
    lastContact: "2024-02-05",
    messages: 12,
    address: "123 Main St, New York, NY",
    notes: "Key decision maker. Prefers email communication.",
  },
  {
    id: "c-2",
    name: "Maria Hernandez",
    email: "maria.h@techstart.io",
    phone: "+1 (555) 234-5678",
    company: "TechStart Inc",
    role: "CTO",
    avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    status: "active",
    lastContact: "2024-02-04",
    messages: 8,
    address: "456 Tech Ave, San Francisco, CA",
    notes: "Technical contact. Interested in API integration.",
  },
  {
    id: "c-3",
    name: "Clara Mason",
    email: "clara.m@globalmedia.com",
    phone: "+1 (555) 345-6789",
    company: "Global Media",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
    status: "lead",
    lastContact: "2024-02-03",
    messages: 5,
    address: "789 Media Blvd, Los Angeles, CA",
    notes: "Potential enterprise client. Follow up next week.",
  },
  {
    id: "c-4",
    name: "Derek White",
    email: "derek.w@designstudio.co",
    phone: "+1 (555) 456-7890",
    company: "Design Studio",
    role: "Creative Director",
    avatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
    status: "active",
    lastContact: "2024-02-02",
    messages: 15,
    address: "321 Design St, Austin, TX",
    notes: "Long-term client. Renewal due in March.",
  },
  {
    id: "c-5",
    name: "Eva Carter",
    email: "eva.c@cloudnet.dev",
    phone: "+1 (555) 567-8901",
    company: "CloudNet Solutions",
    role: "VP Engineering",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80",
    status: "inactive",
    lastContact: "2024-01-15",
    messages: 3,
    address: "555 Cloud Dr, Seattle, WA",
    notes: "Contract ended. Potential re-engagement opportunity.",
  },
  {
    id: "c-6",
    name: "Frank Zhou",
    email: "frank.z@brightideas.co",
    phone: "+1 (555) 678-9012",
    company: "Bright Ideas Agency",
    role: "Founder",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80",
    status: "lead",
    lastContact: "2024-02-01",
    messages: 2,
    address: "888 Innovation Way, Boston, MA",
    notes: "Referred by Derek White. Schedule intro call.",
  },
  {
    id: "c-7",
    name: "Grace Lee",
    email: "grace.l@dataflow.io",
    phone: "+1 (555) 789-0123",
    company: "DataFlow Systems",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80",
    status: "active",
    lastContact: "2024-02-05",
    messages: 20,
    address: "222 Data Ln, Chicago, IL",
    notes: "Active user. Provides valuable feedback.",
  },
  {
    id: "c-8",
    name: "Henry Ford",
    email: "henry.f@nexus.digital",
    phone: "+1 (555) 890-1234",
    company: "Nexus Digital",
    role: "Operations Manager",
    avatar: "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80",
    status: "active",
    lastContact: "2024-02-04",
    messages: 7,
    address: "444 Nexus Rd, Denver, CO",
    notes: "Needs training session for new team members.",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  lead: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export default function ContactPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl leading-none tracking-tight">Contacts</h1>
        <p className="text-muted-foreground text-sm">Manage your contacts and communications</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Contacts</CardTitle>
                <CardDescription>{filteredContacts.length} contacts found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="lead">Leads</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="flex flex-col gap-2">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                      selectedContact?.id === contact.id ? "border-primary bg-accent" : ""
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{contact.name}</span>
                        <Badge className={statusColors[contact.status]}>{contact.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">
                          {contact.company} • {contact.role}
                        </span>
                        <span className="text-muted-foreground text-xs">{contact.messages} messages</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {selectedContact ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                      <CardDescription>
                        {selectedContact.role} at {selectedContact.company}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Badge className={statusColors[selectedContact.status]}>{selectedContact.status}</Badge>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedContact.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last contact: {selectedContact.lastContact}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-1 font-medium text-sm">Notes</p>
                    <p className="text-muted-foreground text-sm">{selectedContact.notes}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Message</CardTitle>
                  <CardDescription>Send a message to {selectedContact.name.split(" ")[0]}</CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" />
                      <p className="font-medium text-sm">Message Sent!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="follow-up">Follow Up</SelectItem>
                            <SelectItem value="meeting">Schedule Meeting</SelectItem>
                            <SelectItem value="proposal">Send Proposal</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Type your message..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium">No contact selected</h3>
                <p className="text-muted-foreground text-sm">Click on a contact to view details and send messages</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
