import { useDragLayer } from "react-dnd";
import ScheduledPreview from "./ScheduledPreview";
import TaskPreview from "./TaskPreview";

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px) rotate(10deg)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}
export const TaskDraggingPreview = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));
  function renderItem() {
    switch (itemType) {
      case "task":
        return <TaskPreview task={item} forceText left={true} right={true} />;
      case "scheduled":
        return (
          <ScheduledPreview
            scheduled={item}
            forceText
            left={true}
            right={true}
          />
        );
      default:
        return null;
    }
  }
  if (!isDragging) {
    return null;
  }
  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 1000000,
        left: 0,
        top: 0,
        width: "150px",
        height: "100%",
      }}
    >
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};
