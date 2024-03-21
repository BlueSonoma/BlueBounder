## Grain Boundary Segmentation

---

This section covers various segmentation techniques use to segment grain boundaries isolating specific chemical regions, most notably silica (quartz).

The execution of the function `segment_boundaries` -- the workhorse of `segment_and_overlay`-- uses images of grain chemistry and overlays their labeled and segmented boundaries onto the band contrast image. The function call is simple and makes the whole process very easy to use. Following the algorithm execution, the resulting images saved and the segmented images generated are plotted next to their masks for visual comparison.

#### Note: This function can take several minutes to complete. There are print statements that update every iteration to notify status.
