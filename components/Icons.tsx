import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Polygon,
  G
} from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

// Clean, minimal SVG icon components

// Home Icon - Simple house shape
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* House roof */}
      <Path
        d="M3 12L12 3L21 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* House base */}
      <Path
        d="M5 12V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Door */}
      <Path
        d="M9 20V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
    </Svg>
  );
};

// Package Icon - Simple box
export const PackageIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Box */}
      <Rect
        x="3"
        y="6"
        width="18"
        height="15"
        rx="2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Vertical line */}
      <Line
        x1="12"
        y1="6"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Horizontal line */}
      <Line
        x1="3"
        y1="13.5"
        x2="21"
        y2="13.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Top flap */}
      <Path
        d="M8 6L12 2L16 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
    </Svg>
  );
};

// Grid Icon - Simple 2x2 grid
export const GridIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top left */}
      <Rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Top right */}
      <Rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Bottom left */}
      <Rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Bottom right */}
      <Rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
    </Svg>
  );
};

// Info Icon - Simple circle with "i"
export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Circle */}
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Dot */}
      <Circle
        cx="12"
        cy="8"
        r="1"
        fill={color}
      />
      {/* Line */}
      <Line
        x1="12"
        y1="12"
        x2="12"
        y2="16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

// User Icon - Simple person silhouette
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head circle */}
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Body */}
      <Path
        d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
    </Svg>
  );
};

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => {
  const strokeWidth = Math.max(2, size / 12);
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Vertical line */}
      <Line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Horizontal line */}
      <Line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Circle */}
      <Circle
        cx="11"
        cy="11"
        r="8"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Handle */}
      <Path
        d="21 21L16.65 16.65"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Settings Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Gear outer */}
      <Path
        d="M12.22 2L13.78 2C14.33 2 14.78 2.45 14.78 3V3.65C15.45 3.93 16.05 4.34 16.54 4.85L17.06 4.33C17.45 3.94 18.08 3.94 18.47 4.33L19.67 5.53C20.06 5.92 20.06 6.55 19.67 6.94L19.15 7.46C19.66 7.95 20.07 8.55 20.35 9.22H21C21.55 9.22 22 9.67 22 10.22V11.78C22 12.33 21.55 12.78 21 12.78H20.35C20.07 13.45 19.66 14.05 19.15 14.54L19.67 15.06C20.06 15.45 20.06 16.08 19.67 16.47L18.47 17.67C18.08 18.06 17.45 18.06 17.06 17.67L16.54 17.15C16.05 17.66 15.45 18.07 14.78 18.35V19C14.78 19.55 14.33 20 13.78 20H12.22C11.67 20 11.22 19.55 11.22 19V18.35C10.55 18.07 9.95 17.66 9.46 17.15L8.94 17.67C8.55 18.06 7.92 18.06 7.53 17.67L6.33 16.47C5.94 16.08 5.94 15.45 6.33 15.06L6.85 14.54C6.34 14.05 5.93 13.45 5.65 12.78H5C4.45 12.78 4 12.33 4 11.78V10.22C4 9.67 4.45 9.22 5 9.22H5.65C5.93 8.55 6.34 7.95 6.85 7.46L6.33 6.94C5.94 6.55 5.94 5.92 6.33 5.53L7.53 4.33C7.92 3.94 8.55 3.94 8.94 4.33L9.46 4.85C9.95 4.34 10.55 3.93 11.22 3.65V3C11.22 2.45 11.67 2 12.22 2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Inner circle */}
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
    </Svg>
  );
};

// Palette Icon
export const PaletteIcon: React.FC<IconProps> = ({ size = 24, color = '#000', focused = false }) => {
  const strokeWidth = Math.max(1.5, size / 16);
  const fillColor = focused ? color : 'none';
  const fillOpacity = focused ? 0.1 : 0;
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main palette shape */}
      <Path
        d="M12 2C13.1 2 14.2 2.3 15.2 2.9C16.2 3.5 17.1 4.4 17.7 5.4C18.3 6.4 18.6 7.5 18.6 8.7C18.6 9.9 18.3 11 17.7 12C17.1 13 16.2 13.9 15.2 14.5C14.2 15.1 13.1 15.4 12 15.4H8C6.9 15.4 6 16.3 6 17.4C6 18.5 6.9 19.4 8 19.4H12C17 19.4 21 15.4 21 10.4C21 5.4 17 1.4 12 1.4C7 1.4 3 5.4 3 10.4C3 12.4 3.8 14.2 5.1 15.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillColor}
        fillOpacity={fillOpacity}
      />
      {/* Paint dots */}
      <Circle cx="7.5" cy="8" r="1" fill={color} />
      <Circle cx="10.5" cy="6" r="1" fill={color} />
      <Circle cx="13.5" cy="6" r="1" fill={color} />
      <Circle cx="16.5" cy="8" r="1" fill={color} />
      <Circle cx="15" cy="11" r="1" fill={color} />
    </Svg>
  );
};