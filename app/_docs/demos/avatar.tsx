"use client";

import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Row } from "./_shared";

export default function Demo() {
  const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus Torvalds", "Margaret Hamilton"];
  return (
    <div className="flex flex-col gap-3">
      <Row label="Size">
        <Avatar name="Ada Lovelace" size="xs" />
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Ada Lovelace" size="md" />
        <Avatar name="Ada Lovelace" size="lg" />
        <Avatar name="Ada Lovelace" size="xl" />
      </Row>
      <Row label="Status">
        <Avatar name="Ada Lovelace" size="lg" status="online" />
        <Avatar name="Grace Hopper" size="lg" status="away" />
        <Avatar name="Alan Turing" size="lg" status="busy" />
        <Avatar name="Linus Torvalds" size="lg" status="offline" />
      </Row>
      <Row label="Group">
        <AvatarGroup max={4}>
          {people.map((p) => (
            <Avatar key={p} name={p} />
          ))}
        </AvatarGroup>
      </Row>
    </div>
  );
}
