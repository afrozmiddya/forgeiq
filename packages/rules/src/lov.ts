// Mock LOV dictionary mapping Attribute Label -> Set of Allowed Values
const MOCK_LOV_REGISTRY: Record<string, Set<string>> = {
  'Material': new Set(['Brass', 'Steel', 'Plastic', 'Copper', 'Aluminum']),
  'Color': new Set(['Chrome', 'Matte Black', 'Brushed Nickel', 'White', 'Red']),
  'Connection Type': new Set(['Threaded', 'Solder', 'Compression', 'Push-to-Connect']),
  'Handle Type': new Set(['Lever', 'Knob', 'Cross', 'Joystick'])
};

export function isValidLOV(attributeLabel: string, value: string): boolean {
  if (!value) return true; // empty values are skipped by LOV check
  
  const allowedSet = MOCK_LOV_REGISTRY[attributeLabel];
  // If the attribute has no strict LOV registered, we allow any value
  if (!allowedSet) return true; 

  return allowedSet.has(value);
}
