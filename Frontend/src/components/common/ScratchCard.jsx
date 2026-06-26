import { useRef, useEffect, useState } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import toast from "react-hot-toast";

function ScratchCard() {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const promoCode = "NEXSMART15";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth || 300;
    canvas.height = canvas.offsetHeight || 160;

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

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    scratch(coords.x, coords.y, true);
  };

  const handleMove = (e) => {
    if (!isDrawing || isScratched) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    scratch(coords.x, coords.y, false);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    checkScratchPercentage();
  };

  const scratch = (x, y, isNew) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 32;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isNew) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
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
    if (percentage > 45 && !isScratched) {
      setIsScratched(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        width: "320px",
        height: "180px",
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
        <Box
          component="canvas"
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "crosshair",
            zIndex: 10,
            borderRadius: "16px",
          }}
        />
      )}
    </Paper>
  );
}

export default ScratchCard;
