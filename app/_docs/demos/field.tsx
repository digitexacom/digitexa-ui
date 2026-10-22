"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Demo() {
  const [key, setKey] = React.useState("WEB");
  const error = /^[A-Z]{2,5}$/.test(key) ? null : "Use 2–5 uppercase letters.";

  return (
    <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <Field>
          <FieldLabel>Project name</FieldLabel>
          <FieldControl>
            <Input defaultValue="Storefront rebuild" />
          </FieldControl>
          <FieldDescription>Shown in the sidebar and in notifications.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Issue key</FieldLabel>
          <FieldControl>
            <Input value={key} onChange={(e) => setKey(e.target.value)} className="w-32 font-mono" />
          </FieldControl>
          <FieldDescription>Prefix for issue ids, like {key || "WEB"}-142.</FieldDescription>
          <FieldError>{error}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Summary</FieldLabel>
          <FieldControl>
            <Textarea placeholder="What is this project about?" />
          </FieldControl>
        </Field>
        <Field orientation="horizontal">
          <FieldControl>
            <Checkbox defaultChecked />
          </FieldControl>
          <FieldLabel>Notify watchers on status changes</FieldLabel>
        </Field>
        <div>
          <Button variant="primary" type="submit" disabled={!!error}>
            Create project
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
