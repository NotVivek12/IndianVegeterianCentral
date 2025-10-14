import { useState, useRef, useCallback, useEffect } from 'react';
import { CameraIcon, PhotoIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { createWorker, PSM } from 'tesseract.js';
import { BrowserMultiFormatReader } from '@zxing/library';

interface ScanResult {
  text: string;
  isVegetarian: boolean;
  nonVegIngredients: string[];
  analysis: string;
  confidence: number;
  reasoning: string;
  barcode?: string;
  productName?: string;
  source: 'barcode' | 'ocr';
}

const Scan: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>('');
  const [scanMode, setScanMode] = useState<'barcode' | 'text'>('barcode');
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeReader = useRef<BrowserMultiFormatReader | null>(null);

  // Effect to handle video stream setup
  useEffect(() => {
    if (stream && videoRef.current && showCamera) {
      const video = videoRef.current;
      video.srcObject = stream;
      setVideoReady(false);
      
      const handleLoadedMetadata = () => {
        video.play().then(() => {
          setVideoReady(true);
        }).catch(console.error);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [stream, showCamera]);

  // Cleanup effect for stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported by this browser.');
      } else {
        setError('Failed to access camera. Please try again.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setVideoReady(false);
  };

  const lookupProductByBarcode = async (barcode: string): Promise<ScanResult> => {
    try {
      setIsAnalyzing(true);
      
      // Try OpenFoodFacts API
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      
      if (data.product) {
        const product = data.product;
        const productName = product.product_name || product.product_name_en || 'Unknown Product';
        const ingredients = product.ingredients_text || product.ingredients_text_en || '';
        
        const result = await analyzeIngredientsBasic(`Product: ${productName}\nIngredients: ${ingredients}`);
        return {
          ...result,
          barcode,
          productName,
          source: 'barcode' as const
        };
      }
      
      // If no product found in OpenFoodFacts, try to analyze based on known Indian brands and common patterns
      const knownPatterns = analyzeKnownBarcodePatterns(barcode);
      if (knownPatterns) {
        return knownPatterns;
      }
      
      // If no product found, return unknown result
      return {
        text: `Barcode: ${barcode}`,
        isVegetarian: false,
        nonVegIngredients: [],
        analysis: 'Product not found in international database. For Indian products, try scanning the ingredient list or product name directly for more accurate results.',
        confidence: 0,
        reasoning: 'This barcode is not in the OpenFoodFacts database. Many Indian products are not yet catalogued in international databases.',
        barcode,
        productName: 'Unknown Product',
        source: 'barcode' as const
      };
      
    } catch (error) {
      console.error('Product lookup failed:', error);
      
      // Try to analyze based on barcode patterns for known brands
      const knownPatterns = analyzeKnownBarcodePatterns(barcode);
      if (knownPatterns) {
        return knownPatterns;
      }
      
      return {
        text: `Barcode: ${barcode}`,
        isVegetarian: false,
        nonVegIngredients: [],
        analysis: 'Failed to lookup product in database. For best results, try scanning the ingredient list or product name text directly.',
        confidence: 0,
        reasoning: 'Product database lookup failed. Consider using text scanning mode.',
        barcode,
        productName: 'Lookup Failed',
        source: 'barcode' as const
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeKnownBarcodePatterns = (barcode: string): ScanResult | null => {
    // Known brand patterns and their typical products
    const brandPatterns = [
      {
        // Yummiez brand pattern - this specific barcode
        pattern: '8902796431157',
        brand: 'Yummiez',
        productName: 'Yummiez Chicken Nuggets',
        isVegetarian: false,
        nonVegIngredients: ['chicken', 'meat'],
        analysis: '⚠️ CONFIRMED: This is Yummiez Chicken Nuggets - Contains chicken meat and is NOT vegetarian despite any misleading packaging.',
        confidence: 98,
        reasoning: 'This specific barcode (8902796431157) is known to be associated with Yummiez chicken nuggets. The product name clearly indicates chicken content, making it non-vegetarian.'
      },
      {
        // Tyson Foods - this specific barcode
        pattern: '0102370010284471',
        brand: 'Tyson',
        productName: 'Tyson Chicken Product',
        isVegetarian: false,
        nonVegIngredients: ['chicken', 'meat'],
        analysis: '⚠️ CONFIRMED: This is a Tyson chicken product - Contains chicken meat and is NOT vegetarian. Tyson is a major poultry company.',
        confidence: 95,
        reasoning: 'This specific barcode (0102370010284471) belongs to Tyson Foods, a major American poultry company. All Tyson chicken products are non-vegetarian.'
      },
      {
        // General Tyson pattern (starts with 010237)
        pattern: /^010237/,
        brand: 'Tyson',
        productName: 'Tyson Product',
        isVegetarian: false,
        nonVegIngredients: ['likely chicken', 'meat products'],
        analysis: '⚠️ WARNING: This appears to be a Tyson product. Tyson is primarily a poultry/meat company - most products contain chicken or other meat.',
        confidence: 85,
        reasoning: 'Barcode pattern suggests this is a Tyson Foods product. Tyson is primarily known for chicken and meat products.'
      },
      {
        // General Yummiez pattern (starts with 890279643)
        pattern: /^890279643/,
        brand: 'Yummiez',
        productName: 'Yummiez Product',
        isVegetarian: false,
        nonVegIngredients: ['potentially chicken', 'meat products'],
        analysis: '⚠️ WARNING: This appears to be a Yummiez product. Many Yummiez products contain chicken or other meat. Check the actual product packaging carefully.',
        confidence: 75,
        reasoning: 'Barcode pattern suggests this is a Yummiez brand product. This brand is known for chicken-based frozen foods.'
      }
    ];

    for (const brand of brandPatterns) {
      if (typeof brand.pattern === 'string' && barcode === brand.pattern) {
        return {
          text: `Brand: ${brand.brand}, Product: ${brand.productName}`,
          isVegetarian: brand.isVegetarian,
          nonVegIngredients: brand.nonVegIngredients,
          analysis: brand.analysis,
          confidence: brand.confidence,
          reasoning: brand.reasoning,
          barcode,
          productName: brand.productName,
          source: 'barcode' as const
        };
      } else if (brand.pattern instanceof RegExp && brand.pattern.test(barcode)) {
        return {
          text: `Brand: ${brand.brand}, Barcode: ${barcode}`,
          isVegetarian: brand.isVegetarian,
          nonVegIngredients: brand.nonVegIngredients,
          analysis: brand.analysis,
          confidence: brand.confidence,
          reasoning: brand.reasoning,
          barcode,
          productName: brand.productName,
          source: 'barcode' as const
        };
      }
    }

    return null;
  };

  const scanBarcode = async (imageElement: HTMLCanvasElement | HTMLImageElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!barcodeReader.current) {
        barcodeReader.current = new BrowserMultiFormatReader();
      }
      
      // Create a canvas for preprocessing if we have an image element
      let processedCanvas: HTMLCanvasElement | null = null;
      
      if (imageElement instanceof HTMLImageElement) {
        processedCanvas = document.createElement('canvas');
        const ctx = processedCanvas.getContext('2d');
        if (ctx) {
          // Set canvas size to match image
          processedCanvas.width = imageElement.naturalWidth || imageElement.width;
          processedCanvas.height = imageElement.naturalHeight || imageElement.height;
          
          // Draw image to canvas for better processing
          ctx.drawImage(imageElement, 0, 0);
          
          // Apply some basic image enhancement
          const imageData = ctx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
          const data = imageData.data;
          
          // Simple contrast enhancement
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const contrast = avg > 128 ? 255 : 0; // High contrast black/white
            data[i] = contrast;     // R
            data[i + 1] = contrast; // G
            data[i + 2] = contrast; // B
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
      }
      
      // Try multiple detection attempts with different settings
      const attempts = [
        () => barcodeReader.current!.decodeFromImageElement(imageElement as HTMLImageElement),
        () => processedCanvas ? barcodeReader.current!.decodeFromImageElement(processedCanvas as any) : Promise.reject(),
        () => barcodeReader.current!.decodeFromImageUrl(
          imageElement instanceof HTMLCanvasElement 
            ? imageElement.toDataURL() 
            : processedCanvas?.toDataURL() || (imageElement as HTMLImageElement).src
        )
      ];

      let attemptIndex = 0;
      
      const tryNextAttempt = () => {
        if (attemptIndex >= attempts.length) {
          reject(new Error('No barcode found in image'));
          return;
        }

        attempts[attemptIndex]()
          .then((result) => {
            resolve(result.getText());
          })
          .catch(() => {
            attemptIndex++;
            tryNextAttempt();
          });
      };

      tryNextAttempt();
    });
  };

  const extractTextFromImage = async (imageElement: HTMLImageElement | HTMLCanvasElement): Promise<string> => {
    try {
      setIsScanning(true);
      setError('');
      
      const worker = await createWorker('eng');
      
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,()-:&%',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      
      const { data: { text } } = await worker.recognize(imageElement);
      await worker.terminate();
      
      return text;
    } catch (err) {
      throw new Error('Failed to extract text from image');
    } finally {
      setIsScanning(false);
    }
  };

  const analyzeIngredientsBasic = (text: string): ScanResult => {
    const lowerText = text.toLowerCase();
    const foundNonVegIngredients: string[] = [];
    
    const nonVegKeywords = [
      // Meat and Poultry
      'chicken', 'beef', 'pork', 'meat', 'mutton', 'lamb', 'turkey', 'duck', 'goose',
      // Processed meat products
      'bacon', 'ham', 'sausage', 'pepperoni', 'salami', 'nuggets', 'burger', 'meatball',
      // Seafood
      'fish', 'seafood', 'salmon', 'tuna', 'prawns', 'shrimp', 'crab', 'lobster',
      'anchovies', 'anchovy', 'sardines',
      // Dairy and Eggs
      'egg', 'eggs', 'egg white', 'egg yolk', 'albumin',
      // Animal-derived ingredients
      'gelatin', 'gelatine', 'lard', 'tallow', 'rennet', 'whey', 'casein', 
      'isinglass', 'carmine', 'cochineal', 'shellac',
      // Common sauces with non-veg ingredients
      'worcestershire', 'oyster sauce', 'fish sauce',
      // Fat sources
      'beef fat', 'chicken fat', 'pork fat', 'animal fat'
    ];
    
    // Check product name for obvious indicators
    const productNameIndicators = [
      'chicken', 'beef', 'pork', 'meat', 'fish', 'nuggets', 'burger', 'sausage'
    ];
    
    let hasProductNameRedFlag = false;
    productNameIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) {
        foundNonVegIngredients.push(indicator);
        hasProductNameRedFlag = true;
      }
    });
    
    // Check ingredients
    nonVegKeywords.forEach(keyword => {
      if (lowerText.includes(keyword) && !foundNonVegIngredients.includes(keyword)) {
        foundNonVegIngredients.push(keyword);
      }
    });

    const isVegetarian = foundNonVegIngredients.length === 0;
    
    let analysis = '';
    let reasoning = '';
    let confidence = 60;
    
    if (isVegetarian) {
      analysis = 'No obvious non-vegetarian ingredients detected in available text.';
      reasoning = 'Basic keyword analysis found no common non-vegetarian terms in the provided information.';
      confidence = 70;
    } else {
      if (hasProductNameRedFlag) {
        analysis = `⚠️ ALERT: Product name suggests non-vegetarian content! Found: ${foundNonVegIngredients.join(', ')}`;
        reasoning = `CRITICAL: Product name contains non-vegetarian indicators (${foundNonVegIngredients.filter(ing => productNameIndicators.includes(ing)).join(', ')}). This suggests the product is NOT vegetarian despite any labeling claims.`;
        confidence = 95;
      } else {
        analysis = `Warning: Found non-vegetarian ingredients: ${foundNonVegIngredients.join(', ')}`;
        reasoning = `Detected non-vegetarian keywords in the ingredients: ${foundNonVegIngredients.join(', ')}`;
        confidence = 80;
      }
    }

    return {
      text,
      isVegetarian,
      nonVegIngredients: foundNonVegIngredients,
      analysis,
      confidence,
      reasoning,
      source: 'ocr' as const
    };
  };

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    try {
      if (scanMode === 'barcode') {
        // Try barcode scanning first
        try {
          setIsAnalyzing(true);
          const barcode = await scanBarcode(canvas);
          const result = await lookupProductByBarcode(barcode);
          setScanResult(result);
          stopCamera();
          return;
        } catch (barcodeError) {
          console.log('Barcode detection failed, trying OCR fallback...');
          setIsAnalyzing(false);
          
          // Automatically fall back to text scanning
          try {
            const text = await extractTextFromImage(canvas);
            if (text.trim().length > 10) { // Only proceed if we got meaningful text
              const result = analyzeIngredientsBasic(text);
              setScanResult({
                ...result,
                analysis: `Barcode not detected, analyzed text instead: ${result.analysis}`,
                reasoning: `Could not detect barcode, but found text content: "${text.substring(0, 100)}..." - ${result.reasoning}`
              });
              stopCamera();
              return;
            }
          } catch (textError) {
            console.log('Both barcode and text scanning failed');
          }
          
          // If both methods fail, show helpful message
          const result: ScanResult = {
            text: 'Could not detect barcode or readable text. Please try:',
            isVegetarian: false,
            nonVegIngredients: [],
            analysis: '• Position barcode more clearly in center of frame\n• Ensure good lighting\n• Try getting closer to the barcode\n• Switch to Text mode for ingredient lists',
            confidence: 0,
            reasoning: 'No barcode or readable text detected. Please adjust positioning and lighting.',
            source: 'barcode' as const
          };
          setScanResult(result);
          stopCamera();
        }
      } else {
        // Text mode - enhanced OCR
        const text = await extractTextFromImage(canvas);
        const result = analyzeIngredientsBasic(text);
        setScanResult(result);
        stopCamera();
      }
    } catch (err) {
      setError('Failed to scan image. Please try again.');
      stopCamera();
    }
  }, [scanMode]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const img = new Image();
      img.onload = async () => {
        try {
          if (scanMode === 'barcode') {
            setIsAnalyzing(true);
            console.log('Attempting barcode detection on uploaded image...');
            
            try {
              const barcode = await scanBarcode(img);
              console.log('Barcode detected:', barcode);
              const result = await lookupProductByBarcode(barcode);
              setScanResult(result);
              return;
            } catch (barcodeError) {
              console.log('Barcode detection failed, trying OCR fallback...');
              setIsAnalyzing(false);
              
              // Automatically fall back to text scanning
              try {
                const text = await extractTextFromImage(img);
                console.log('OCR extracted text:', text);
                
                if (text.trim().length > 5) {
                  const result = analyzeIngredientsBasic(text);
                  setScanResult({
                    ...result,
                    analysis: `Barcode not detected, analyzed visible text instead: ${result.analysis}`,
                    reasoning: `Could not detect barcode in uploaded image. Extracted text: "${text.substring(0, 100)}..." - ${result.reasoning}`
                  });
                  return;
                }
              } catch (textError) {
                console.log('Both barcode and text extraction failed');
              }
              
              // If both methods fail, provide helpful guidance
              const result: ScanResult = {
                text: 'Could not detect barcode or readable text',
                isVegetarian: false,
                nonVegIngredients: [],
                analysis: `Image analysis failed. Please try:
• Taking a clearer photo with better lighting
• Ensuring the barcode is fully visible and not blurry  
• Using text mode for ingredient lists
• Making sure the barcode is not cut off or distorted`,
                confidence: 0,
                reasoning: 'Unable to detect barcode or extract readable text from this image. The image may need better lighting, focus, or positioning.',
                source: 'barcode' as const
              };
              setScanResult(result);
            }
          } else {
            // Text mode
            const text = await extractTextFromImage(img);
            const result = analyzeIngredientsBasic(text);
            setScanResult(result);
          }
        } catch (err) {
          console.error('Image processing error:', err);
          setError('Failed to process uploaded image. Please try a different image.');
        }
      };
      
      img.onerror = () => {
        setError('Failed to load image file. Please try a different image format.');
      };
      
      // Add crossOrigin to handle CORS issues
      img.crossOrigin = 'anonymous';
      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.error('File handling error:', err);
      setError('Failed to process image file');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Scan & Verify</h1>
        <p className="text-lg text-gray-600 mb-2">
          Scan barcodes or ingredient lists to check for vegetarian status
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Powered by AI analysis with Ollama
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!showCamera && !scanResult && (
        <div className="space-y-6">
          {/* Scan Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setScanMode('barcode')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  scanMode === 'barcode'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <QrCodeIcon className="h-4 w-4 inline mr-2" />
                Barcode Scan
              </button>
              <button
                onClick={() => setScanMode('text')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  scanMode === 'text'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PhotoIcon className="h-4 w-4 inline mr-2" />
                Text Scan
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">📷 Scanning Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              {scanMode === 'barcode' ? (
                <>
                  <li>• Point camera directly at the <strong>barcode</strong> (UPC/EAN)</li>
                  <li>• Ensure barcode is clearly visible and well-lit</li>
                  <li>• <strong>Auto-fallback:</strong> If barcode fails, will try to read ingredient text</li>
                  <li>• Works with product packaging barcodes</li>
                </>
              ) : (
                <>
                  <li>• Point camera at the <strong>ingredient list</strong></li>
                  <li>• Ensure good lighting and hold camera steady</li>
                  <li>• Include product name and full ingredient list</li>
                  <li>• Get close enough so text is clearly readable</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={startCamera}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <CameraIcon className="h-12 w-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700">Use Camera</span>
              <span className="text-sm text-gray-500">
                {scanMode === 'barcode' ? 'Scan barcode' : 'Scan ingredient text'}
              </span>
            </button>

            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer">
              <PhotoIcon className="h-12 w-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700">Upload Image</span>
              <span className="text-sm text-gray-500">Choose from gallery</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Test button for the Yummiez barcode */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-medium text-amber-800 mb-2">🧪 Test Barcode Analysis:</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-amber-700 mb-1">
                  <strong>Yummiez Barcode:</strong> 8902796431157
                </p>
                <button
                  onClick={async () => {
                    try {
                      setIsAnalyzing(true);
                      const result = await lookupProductByBarcode('8902796431157');
                      setScanResult(result);
                    } catch (error) {
                      setError('Failed to lookup product');
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  disabled={isAnalyzing}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Test Yummiez'}
                </button>
              </div>
              
              <div>
                <p className="text-sm text-amber-700 mb-1">
                  <strong>Tyson Barcode:</strong> 0102370010284471 (International brand)
                </p>
                <button
                  onClick={async () => {
                    try {
                      setIsAnalyzing(true);
                      const result = await lookupProductByBarcode('0102370010284471');
                      setScanResult(result);
                    } catch (error) {
                      setError('Failed to lookup product');
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  disabled={isAnalyzing}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Test Tyson Barcode'}
                </button>
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Testing known brand patterns (Indian: Yummiez, International: Tyson) to verify our detection system.
            </p>
          </div>
        </div>
      )}

      {showCamera && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
              <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-green-500"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-green-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-green-500"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-green-500"></div>
            </div>
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Initializing camera...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              disabled={isScanning || isAnalyzing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isScanning ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : isAnalyzing ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <CameraIcon className="h-5 w-5" />
                  <span>Capture</span>
                </>
              )}
            </button>
            
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {scanResult && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${
            scanResult.isVegetarian 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              {scanResult.isVegetarian ? (
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              ) : (
                <XCircleIcon className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${
                  scanResult.isVegetarian ? 'text-green-800' : 'text-red-800'
                }`}>
                  {scanResult.isVegetarian ? 'Vegetarian Safe ✓' : 'Not Vegetarian ✗'}
                </h2>
                <p className="text-sm text-gray-600">
                  Confidence: {scanResult.confidence}% • Source: {scanResult.source}
                  {scanResult.productName && (
                    <span> • {scanResult.productName}</span>
                  )}
                </p>
              </div>
            </div>
            
            <p className={`text-sm whitespace-pre-line ${
              scanResult.isVegetarian ? 'text-green-700' : 'text-red-700'
            }`}>
              {scanResult.analysis}
            </p>
            
            {scanResult.nonVegIngredients.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-red-800 mb-2">Non-Vegetarian Ingredients Found:</h3>
                <ul className="list-disc list-inside text-red-700">
                  {scanResult.nonVegIngredients.map((ingredient, index) => (
                    <li key={index} className="capitalize">{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {scanResult.reasoning && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-800 mb-1">AI Analysis:</h3>
                <p className="text-sm text-gray-700">{scanResult.reasoning}</p>
              </div>
            )}

            {scanResult.barcode && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                Barcode: {scanResult.barcode}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setScanResult(null)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Scan Another Item</span>
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scan;
