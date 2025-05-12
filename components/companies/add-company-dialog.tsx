"use client"

import { useState } from "react"

export function AddCompanyDialog() {
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeTab, setActiveTab]
