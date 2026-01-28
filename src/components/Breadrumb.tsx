import React from "react";
import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Define types for the component's props
interface BreadcrumbItemType {
  href?: string; // Optional link, used for non-page items
  label: string; // Text to display in the breadcrumb
  isCurrentPage?: boolean; // Flag to indicate if this is the current page
}

interface BreadcrumbProps {
  items: BreadcrumbItemType[]; // Array of breadcrumb items
  separator?: React.ReactNode; // Custom separator (default is a Slash)
}

const DefaultSeparator = <Slash />; // Default separator icon

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({
  items,
  separator = DefaultSeparator,
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
