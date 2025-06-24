import type { ListItemType, ListTypeLabel } from "..";
import { ItemDetailSkeleton } from "./ItemDetailSkeleton";

interface Props {
  type: ListTypeLabel;
  item: ListItemType;
  isLoading: boolean;
}

const ItemDetails = ({ isLoading = false, item }: Props) => {
  if (isLoading && !item) {
    return <ItemDetailSkeleton />;
  }

  if (!item) {
    return null;
  }

  return (
    <div className="rounded-md flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
          Code: {item.code}
        </div>
        <h3 className="text-sm font-bold">{item.name}</h3>
      </div>
      <span className="text-xs text-dark">{item.description}</span>
      {(item?.componentsCount || item?.subComponentsCount) && (
        <div className="flex flex-col gap-2 border border-basic-300 rounded-md p-3">
          {item?.componentsCount !== undefined && (
            <h6 className="text-xs font-medium">
              Components: {item?.componentsCount}
            </h6>
          )}
          {item?.subComponentsCount !== undefined && (
            <h6 className="text-xs font-medium">
              Sub-Components: {item?.subComponentsCount}
            </h6>
          )}
        </div>
      )}
      {item?.measurementScales && item.measurementScales.length > 0 && (
        <>
          <h6 className="text-sm font-bold ">Measurement Scales</h6>
          {item.measurementScales.map((scale) => (
            <div className="flex flex-col gap-2 border border-basic-300 rounded-md p-3">
              <div key={scale.id} className="flex items-center gap-2">
                <h6 className="text-xs font-medium">{scale.name}</h6>
                <span className="text-xs text-dark">{scale.description}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default ItemDetails;
