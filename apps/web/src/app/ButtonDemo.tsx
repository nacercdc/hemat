import React from "react";
import { Button } from "../../../../packages/web-ui-components/src/forms/button";
import { Icon } from "@iconify/react/dist/iconify.js";

const ButtonDemo = () => {
  const variants = ["default", "outline", "ghost", "link", "default"] as const;
  const colors = [
    "default",
    "destructive",
    "success",
    "info",
    "warning",
    "dark",
  ] as const;

  return (
    <div className="p-8 space-y-8">
      {variants.map((variant, variantIndex) => (
        <div key={`${variant}-${variantIndex}`} className="space-y-4">
          <h2 className="text-xl font-semibold capitalize">
            {variant} Variant
          </h2>
          <div className="flex flex-wrap gap-4">
            {colors.map((color, colorIndex) => (
              <Button
                key={`${variant}-${color}-${colorIndex}`}
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
          <Button size="sm" color="default">
            Small
          </Button>
          <Button size="md" color="default">
            Medium
          </Button>
          <Button size="lg" color="default">
            Large
          </Button>
        </div>
      </div>

      {/* Loading State */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loading State</h2>
        <div className="flex flex-wrap gap-4">
          {colors.map((color, colorIndex) => (
            <Button
              key={`loading-${color}-${colorIndex}`}
              color={color}
              loading={true}
            >
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
            color="default"
            leftNode={
              <Icon icon="mingcute:left-fill" className="mr-2 h-4 w-4" />
            }
          >
            Back
          </Button>
          <Button
            color="success"
            rightNode={
              <Icon icon="mingcute:right-fill" className="ml-2 h-4 w-4" />
            }
          >
            Next
          </Button>
          <Button
            color="destructive"
            leftNode={
              <Icon
                icon="material-symbols:download-rounded"
                className="mr-2 h-4 w-4"
              />
            }
            rightNode={
              <Icon
                icon="material-symbols:link-rounded"
                className="ml-2 h-4 w-4"
              />
            }
          >
            Download
          </Button>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled State</h2>
        <div className="flex flex-wrap gap-4">
          {variants.map((variant, variantIndex) => (
            <Button
              key={`disabled-${variant}-${variantIndex}`}
              variant={variant}
              color="default"
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
