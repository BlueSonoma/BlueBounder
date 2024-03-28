import { Colors } from '../../../types';

export const initialState = {
  outputPath: '',
  outputFilename: '',
  maskPath: '',
  bandContrastPath: '',
  bandContrastScale: 200,
  bandContrastSigma: 0.55,
  bandContrastMinSize: 300,
  bandContrastOutlineColor: Colors.Black,
  maskScale: 10,
  maskSigma: 0.1,
  maskMinSize: 10,
  maskOutlineColor: Colors.Black,
  labelRegions: true,
  uniformLabel: true,
  labelColor: Colors.Yellow,
  labelOpacity: 1.0,
  borderColor: Colors.Black,
  overlayOpacity: 1.0,
};
