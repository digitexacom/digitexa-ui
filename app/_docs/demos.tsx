"use client";

import * as React from "react";
import { ArrowRightIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-2xs font-medium tracking-wide text-fg-subtle uppercase">{label}</span>
      {children}
    </div>
  );
}

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Varyant">
        <Button variant="primary">
          <PlusIcon /> Yeni görev
        </Button>
        <Button>İkincil</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">
          <TrashIcon /> Sil
        </Button>
        <Button variant="link">
          Bağlantı <ArrowRightIcon />
        </Button>
      </Row>
      <Row label="Boyut">
        <Button size="sm">Küçük · 24</Button>
        <Button size="md">Orta · 30</Button>
        <Button size="lg">Büyük · 36</Button>
        <Button size="icon" aria-label="Ekle">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Ekle">
          <PlusIcon />
        </Button>
      </Row>
      <Row label="Durum">
        <Button variant="primary" disabled>
          Pasif
        </Button>
        <Button asChild variant="secondary">
          <a href="#dialog">asChild → &lt;a&gt;</a>
        </Button>
      </Row>
    </div>
  );
}

export function InputDemo() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Proje adı" />
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-subtle" />
        <Input placeholder="Ara…" className="pl-8" />
      </div>
      <div className="flex flex-col gap-1">
        <Input aria-invalid defaultValue="erdi@" />
        <span className="text-xs text-danger">Geçerli bir e-posta girin.</span>
      </div>
      <div className="flex gap-2">
        <Input size="sm" placeholder="sm · 24" />
        <Input placeholder="md · 30" />
        <Input size="lg" placeholder="lg · 36" />
      </div>
      <Input disabled placeholder="Pasif" />
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="Durum">
        <StatusBadge status="backlog" />
        <StatusBadge status="todo" />
        <StatusBadge status="progress" />
        <StatusBadge status="review" />
        <StatusBadge status="done" />
      </Row>
      <Row label="Semantik">
        <Badge>Nötr</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="accent">Vurgu</Badge>
        <Badge variant="success">Başarılı</Badge>
        <Badge variant="warning">Uyarı</Badge>
        <Badge variant="danger">Hata</Badge>
        <Badge variant="info">Bilgi</Badge>
      </Row>
    </div>
  );
}

export function DialogDemo() {
  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">
            <PlusIcon /> Görev oluştur
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni görev</DialogTitle>
            <DialogDescription>Görev panoya “Yapılacak” sütununa eklenir.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Başlık</span>
              <Input autoFocus placeholder="Ör. Ana sayfa hero görselini güncelle" />
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-fg-muted">Durum:</span>
              <StatusBadge status="todo" />
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Vazgeç</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="primary">Oluştur</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="danger">
            <TrashIcon /> Sil…
          </Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Projeyi sil?</DialogTitle>
            <DialogDescription>Bu işlem geri alınamaz. 24 görev ve tüm yorumlar silinir.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Vazgeç</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger">Sil</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
