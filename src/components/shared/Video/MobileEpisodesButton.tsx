import EpisodesIcon from "@/components/icons/EpisodesIcon";
import React, { Children, useCallback } from "react";
import Portal from "../Portal";
import MobileControlsIcon from "./MobileControlsIcon";

interface MobileEpisodesButtonProps {
  children(
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): React.ReactNode;
}

const MobileEpisodesButton: React.FC<MobileEpisodesButtonProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div>
      <MobileControlsIcon
        title="Tập phim"
        Icon={EpisodesIcon}
        onClick={handleClick}
      />

      <Portal selector=".video-wrapper">{children(isOpen, setIsOpen)}</Portal>
    </div>
  );
};

export default MobileEpisodesButton;
