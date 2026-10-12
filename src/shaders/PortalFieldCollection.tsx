import {
  CloudField,
  type NeuformIsolatedEffectProps,
} from "./neuform-isolated/NeuformIsolatedEffects";
import "./threeui.css";

/**
 * Configured ThreeUI usage surface. The registered "cloud-field" variant
 * resolves to the source bundle's CloudField effect ("Strata cloud
 * migration field", sources/strata-cloud.html). hue/saturation/brightness
 * forward to the effect's color filter.
 */
export function PortalFieldCollection({
  hue,
  saturation,
  brightness,
}: {
  variant: "cloud-field";
  hue?: number;
  saturation?: number;
  brightness?: number;
}) {
  const effectProps: NeuformIsolatedEffectProps = {};
  if (hue !== undefined) effectProps.hue = hue;
  if (saturation !== undefined) effectProps.saturation = saturation;
  if (brightness !== undefined) effectProps.brightness = brightness;

  return <CloudField {...effectProps} />;
}
