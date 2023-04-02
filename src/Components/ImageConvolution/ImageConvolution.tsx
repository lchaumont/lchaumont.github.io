import React from "react";
import "./ImageConvolution.css";

type PixelData = {
    r: number;
    g: number;
    b: number;
    a: number;
};

type PixelDataComputed = PixelData & {
    computed_r: number;
    computed_g: number;
    computed_b: number;
    computed_a: number;
};

const ImageConvolution = () => {
    const [convulationMatrix, setConvulationMatrix] = React.useState<number[][]>([]);

    const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputFile = document.querySelector("input[name='file-picker']") as HTMLInputElement;
        const fileData = inputFile.files?.[0];

        if (fileData) {
            const originalImageCanvas = document.getElementById("original-image-canvas") as HTMLCanvasElement;
            var originalImageContext = originalImageCanvas.getContext("2d") as CanvasRenderingContext2D;
            if (originalImageContext)
                originalImageContext.clearRect(0, 0, originalImageCanvas.width, originalImageCanvas.height);

            // Draw original image in canvas #original-image-canvas
            var image = new Image();
            image.src = URL.createObjectURL(fileData as Blob);
            image.onload = function () {
                var loadedImageWidth = image.width;
                var loadedImageHeight = image.height;

                originalImageCanvas.width = loadedImageWidth;
                originalImageCanvas.height = loadedImageHeight;

                var scale_factor = Math.min(
                    originalImageCanvas.width / loadedImageWidth,
                    originalImageCanvas.height / loadedImageHeight
                );

                var newWidth = loadedImageWidth * scale_factor;
                var newHeight = loadedImageHeight * scale_factor;

                var x = originalImageCanvas.width / 2 - newWidth / 2;
                var y = originalImageCanvas.height / 2 - newHeight / 2;

                originalImageContext?.drawImage(image, x, y, newWidth, newHeight);
            };
        }
    };

    const submitHandler = () => {
        convulateAndAppendInCanvas(convulationMatrix);
    };

    const convulateAndAppendInCanvas = (convulationMatrix: number[][]) => {
        const originalImageCanvas = document.getElementById("original-image-canvas") as HTMLCanvasElement;
        var originalImageContext = originalImageCanvas.getContext("2d") as CanvasRenderingContext2D;

        const convulatedImageCanvas = document.getElementById("convulated-image-canvas") as HTMLCanvasElement;
        var convulatedImageContext = convulatedImageCanvas.getContext("2d");

        if (originalImageContext && convulatedImageContext) {
            var convulatedImageData = convulate(
                originalImageContext.getImageData(0, 0, originalImageCanvas.width, originalImageCanvas.height),
                convulationMatrix
            );

            convulatedImageCanvas.width = convulatedImageData.width;
            convulatedImageCanvas.height = convulatedImageData.height;

            convulatedImageContext.clearRect(0, 0, convulatedImageData.width, convulatedImageData.height);
            convulatedImageContext.putImageData(convulatedImageData, 0, 0);
        }
    };

    const convulate = (imageData: ImageData, convulationMatrix: number[][]) => {
        var newImageData = new ImageData(imageData.width, imageData.height);

        for (var y = 0; y < imageData.height; y++) {
            for (var x = 0; x < imageData.width; x++) {
                var computedPixelIndex = (y * imageData.width + x) * 4;
                var computedPixel = getComputedPixel(imageData, computedPixelIndex);
                var convulationMatrixCefficientToRecover = 0;

                for (var i = 0; i < convulationMatrix.length; i++) {
                    for (var j = 0; j < convulationMatrix[i].length; j++) {
                        var index =
                            ((y - (i - (convulationMatrix.length - 1) / 2)) * imageData.width +
                                (x + (j - (convulationMatrix.length - 1) / 2))) *
                            4;
                        var pixel = getPixel(imageData, index);

                        var convulationMatrixCefficient = convulationMatrix[i][j];
                        if (pixel === undefined) {
                            convulationMatrixCefficientToRecover += convulationMatrixCefficient;
                            continue;
                        }

                        computedPixel.computed_r += convulationMatrixCefficient * pixel.r;
                        computedPixel.computed_g += convulationMatrixCefficient * pixel.g;
                        computedPixel.computed_b += convulationMatrixCefficient * pixel.b;
                        computedPixel.computed_a += convulationMatrixCefficient * pixel.a;
                    }
                }

                if (convulationMatrixCefficientToRecover !== 0) {
                    computedPixel.computed_r += convulationMatrixCefficientToRecover * computedPixel.r;
                    computedPixel.computed_g += convulationMatrixCefficientToRecover * computedPixel.g;
                    computedPixel.computed_b += convulationMatrixCefficientToRecover * computedPixel.b;
                    computedPixel.computed_a += convulationMatrixCefficientToRecover * computedPixel.a;
                }

                setPixel(newImageData, computedPixelIndex, computedPixel);
            }
        }

        return newImageData;
    };

    const getPixel = (imageData: ImageData, index: number): PixelData | undefined => {
        return imageData.data[index]
            ? {
                  r: imageData.data[index],
                  g: imageData.data[index + 1],
                  b: imageData.data[index + 2],
                  a: imageData.data[index + 3],
              }
            : undefined;
    };

    const getComputedPixel = (imageData: ImageData, index: number): PixelDataComputed => {
        return {
            r: imageData.data[index],
            g: imageData.data[index + 1],
            b: imageData.data[index + 2],
            a: imageData.data[index + 3],
            computed_r: 0,
            computed_g: 0,
            computed_b: 0,
            computed_a: 0,
        };
    };

    const setPixel = (imageData: ImageData, index: number, pixel: PixelDataComputed) => {
        imageData.data[index] = pixel.computed_r;
        imageData.data[index + 1] = pixel.computed_g;
        imageData.data[index + 2] = pixel.computed_b;
        imageData.data[index + 3] = 255;
    };

    const onChangeMatrixEditorHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        var matrixString = event.target.value;
        matrixString = matrixString.replace(/[\s\r\n]/g, "");

        if (matrixString.startsWith("[[") && matrixString.endsWith("]]")) {
            // Remove the outer brackets
            matrixString = matrixString.slice(2, -2);

            var rows = matrixString.split("],[");
            var matrix = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var columns = row.split(",");
                var parsedRow = [];
                for (var j = 0; j < columns.length; j++) {
                    parsedRow.push(parseFloat(columns[j]));
                }
                matrix.push(parsedRow);
            }

            setConvulationMatrix(matrix);
        } else {
            // If the string is not in the correct format, do nothing
        }
    };

    return (
        <div className="container container-margin">
            <div className="row">
                <div className="col s12">
                    <div className="file-field input-field">
                        <div className="btn secondary">
                            <span>Choisir une image</span>
                            <input type="file" name="file-picker" accept="image/*" onChange={onFileChangeHandler} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" name="file-path" type="text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col s12">
                    <textarea className="matrix-editor" onChange={onChangeMatrixEditorHandler}></textarea>
                </div>
            </div>

            <div className="row">
                <div className="col s12">
                    <button className="btn secondary waves-effect waves-light" onClick={submitHandler}>
                        GO !<i className="material-icons right">send</i>
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col s6">
                    <div className="row">
                        <label htmlFor="original-image-canvas" className="canvas-label">
                            Image originale
                        </label>
                    </div>

                    <div className="row canvas-container">
                        <canvas id="original-image-canvas"></canvas>
                    </div>
                </div>

                <div className="col s6">
                    <div className="row">
                        <label htmlFor="convulated-image-canvas" className="canvas-label">
                            Image calculé
                        </label>
                    </div>

                    <div className="row canvas-container">
                        <canvas id="convulated-image-canvas"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageConvolution;
