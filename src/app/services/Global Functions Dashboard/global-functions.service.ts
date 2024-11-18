import { Injectable } from '@angular/core';
import * as bodyPix from '@tensorflow-models/body-pix';
import { DatePipe } from '@angular/common';

@Injectable(
)

export class GlobalFunctionsService {
  model: bodyPix.BodyPix | undefined;

  constructor(
    private datePipe:
      DatePipe,
  ) {
  }
  async detectHuman(imageElement: HTMLImageElement): Promise<boolean> {
    try {
      console.log("Loading BodyPix model...");
      this.model = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      });

      if (!this.model) {
        console.error("Failed to load BodyPix model.");
        return false;
      }

      const segmentation = await this.model.segmentPerson(imageElement, {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7,
      });

      const isHuman = segmentation.data.some((value) => value === 1);
      if (!isHuman) {

        return false;
      }

      return isHuman;
    } catch (error) {
      console.error("Error detecting human:", error);
      return false;
    }
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  public formatHour(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'HH:mm') || '';
  }
}
