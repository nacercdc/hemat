import React from "react";
import { Button } from "../../../../packages/web-ui-components/src/forms/button";
import { Icon } from "@iconify/react/dist/iconify.js";

const ButtonDemo = () => {
  const variants = ["default", "outline", "ghost", "link", "primary"] as const;
  const colors = [
    "primary",
    "secondary",
    "success",
    "failed",
    "warning",
  ] as const;

  return (
    <div className="p-8 space-y-8">
      {variants.map((variant) => (
        <div key={variant} className="space-y-4">
          <h2 className="text-xl font-semibold capitalize">
            {variant} Variant
          </h2>
          <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <Button
                key={`${variant}-${color}`}
                variant={variant}
                color={color}
                leftNode={<Icon icon="check" className="mr-2 h-4 w-4" />}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Size Variations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Size Variations</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm" color="primary">
            Small
          </Button>
          <Button size="md" color="primary">
            Medium
          </Button>
          <Button size="lg" color="primary">
            Large
          </Button>
        </div>
      </div>

      {/* Loading State */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loading State</h2>
        <div className="flex flex-wrap gap-4">
          {colors.map((color) => (
            <Button key={`loading-${color}`} color={color} loading={true}>
              Loading
            </Button>
          ))}
        </div>
      </div>

      {/* With Left and Right Nodes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            color="primary"
            leftNode={<Icon icon="arrow-left" className="mr-2 h-4 w-4" />}
          >
            Back
          </Button>
          <Button
            color="success"
            rightNode={<Icon icon="arrow-right" className="ml-2 h-4 w-4" />}
          >
            Next
          </Button>
          <Button
            color="secondary"
            leftNode={<Icon icon="download" className="mr-2 h-4 w-4" />}
            rightNode={<Icon icon="external-link" className="ml-2 h-4 w-4" />}
          >
            Download
          </Button>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled State</h2>
        <div className="flex flex-wrap gap-4">
          {variants.map((variant) => (
            <Button
              key={`disabled-${variant}`}
              variant={variant}
              color="primary"
              disabled
            >
              Disabled {variant}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;
