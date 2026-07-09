import { useRef, useEffect, useState, useCallback } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import toast from "react-hot-toast";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 180;

function ScratchCard() {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPoint = useRef(null);

  const promoCode = "NEXSMART15";

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set actual pixel dimensions (not CSS dimensions)
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Scratchable surface (silver metallic gradient)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#C0C0C0");
    gradient.addColorStop(0.5, "#E0E0E0");
    gradient.addColorStop(1, "#A0A0A0");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative glare line
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(canvas.width, canvas.height - 30);
    ctx.stroke();

    // Instructions
    ctx.font = "bold 15px 'Poppins', sans-serif";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH TO REVEAL DISCOUNT", canvas.width / 2, canvas.height / 2);
  }, []);

  useEffect(() => {
    if (!isScratched) {
      // Small timeout to ensure the canvas element is rendered with correct dimensions
      const timer = setTimeout(initCanvas, 50);
      return () => clearTimeout(timer);
    }
  }, [isScratched, initCanvas]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Scale coordinates to match canvas pixel dimensions
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e) => {
    if (isScratched) return;
    setIsDrawing(true);
    const coords = getCoordinates(e);
    lastPoint.current = coords;
    scratch(coords.x, coords.y);
  };

  const handleMove = (e) => {
    if (!isDrawing || isScratched) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    scratchLine(lastPoint.current.x, lastPoint.current.y, coords.x, coords.y);
    lastPoint.current = coords;
  };

  const handleEnd = () => {
    setIsDrawing(false);
    lastPoint.current = null;
    checkScratchPercentage();
  };

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  const scratchLine = (fromX, fromY, toX, toY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 36;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percentage = (transparentCount / (pixels.length / 4)) * 100;
    if (percentage > 40 && !isScratched) {
      setIsScratched(true);
      toast.success("Congratulations! You revealed a 15% discount code! 🎉");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    toast.success("Promo code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FAFAFA",
        userSelect: "none",
        mx: "auto"
      }}
    >
      {/* Background discount reveal area */}
      <Box sx={{ textAlign: "center", p: 2, zIndex: 1 }}>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={1}>
          <AutoAwesomeIcon sx={{ color: "#FFB300" }} />
          <Typography variant="subtitle2" fontWeight="700" color="#E23744">
            SPECIAL REWARD
          </Typography>
        </Stack>
        <Typography variant="h5" fontWeight="900" color="#111827">
          15% OFF DISCOUNT
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
          Applies to all Tech accessories
        </Typography>

        {isScratched ? (
          <Button
            size="small"
            variant="outlined"
            onClick={handleCopy}
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            sx={{
              borderColor: "#111827",
              color: "#111827",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "50px",
            }}
          >
            {copied ? "Copied" : promoCode}
          </Button>
        ) : (
          <Typography variant="body2" fontWeight="600" color="text.secondary">
            Scratch above to unlock
          </Typography>
        )}
      </Box>

      {/* Canvas Overlay for scratching */}
      {!isScratched && (
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "crosshair",
            zIndex: 10,
            borderRadius: "16px",
            touchAction: "none",
          }}
        />
      )}
    </Paper>
  );
}

export default ScratchCard;
