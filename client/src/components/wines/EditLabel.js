import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import TextField from '@material-ui/core/TextField';
import translations from '../../misc/translations.json';
import f from '../../misc/fonts.json';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

function EditLabel(props) {
  console.log(props.labelId);
  const labels = translations[props.settings.language];
  const fonts = f['fonts'];
  const [labelId, setLabelId] = useState(null);
  const [context, setContext] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [img, setImg] = useState(null);
  const [nameColor, setNameColor] = useState({ r: 0, g: 0, b: 0 });
  const [dateColor, setDateColor] = useState({ r: 0, g: 0, b: 0 });
  const [bgColor, setBgColor] = useState({ r: 255, g: 255, b: 255 });
  const [nameFont, setNameFont] = useState({ size: '30', font: 'Arial' });
  const [dateFont, setDateFont] = useState({ size: '15', font: 'Arial' });
  const [options, setOptions] = useState({
    nameColor,
    dateColor,
    bgColor,
    nameFont,
    dateFont,
  });
  const [undos, setUndos] = useState([]);
  const [redos, setRedos] = useState([]);
  const [changed, setChanged] = useState(false);
  const canvasRef = React.createRef();
  function saveLabel() {
    const imgData = canvas.toDataURL('image/png');
    fetch('../../api/wines/labels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.user.token,
      },
      body: JSON.stringify({ image: imgData, labelId }),
    });
  }
  function handleAddLabel() {
    const newLabel = Date.now();
    setLabelId(newLabel);
  }
  function handleUndo() {
    setRedos(redos.concat(options));
    setOptions(undos[undos.length - 1]);
    setNameColor(undos[undos.length - 1].nameColor);
    setDateColor(undos[undos.length - 1].dateColor);
    setBgColor(undos[undos.length - 1].bgColor);
    setNameFont(undos[undos.length - 1].nameFont);
    setDateFont(undos[undos.length - 1].dateFont);
    setUndos(undos.slice(0, undos.length - 1));
  }
  function handleRedo() {
    setUndos(undos.concat(options));
    setOptions(redos[redos.length - 1]);
    setNameColor(redos[redos.length - 1].nameColor);
    setDateColor(redos[redos.length - 1].dateColor);
    setBgColor(redos[redos.length - 1].bgColor);
    setNameFont(redos[redos.length - 1].nameFont);
    setDateFont(redos[redos.length - 1].dateFont);
    setRedos(redos.slice(0, redos.length - 1));
  }
  useEffect(() => {
    if (changed) {
      setUndos(undos.concat(options));
      setRedos([]);
      setOptions({
        nameColor,
        dateColor,
        bgColor,
        nameFont,
        dateFont,
      });
      setChanged(false);
    }
  }, [
    nameColor,
    dateColor,
    bgColor,
    nameFont,
    dateFont,
    undos,
    options,
    changed,
  ]);
  useEffect(() => {
    if (canvasRef.current != null) {
      setCanvas(canvasRef.current);
      setContext(canvasRef.current.getContext('2d'));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (context != null && canvas != null) {
      canvas.ondrop = function (event) {
        event.preventDefault();
        setImg(event.dataTransfer.files[0]);
      };
      canvas.ondragover = function (event) {
        event.preventDefault();
      };
      if (img != null) {
        const imgElem = new Image();
        imgElem.src = img.src = URL.createObjectURL(img);
        imgElem.onload = function () {
          context.drawImage(
            imgElem,
            canvas.width / 2 - (canvas.width * 0.5) / 2,
            20,
            canvas.width * 0.5,
            imgElem.height / (imgElem.width / (canvas.width * 0.5))
          );
        };
      }
      context.fillStyle = `rgba(${options.bgColor.r},${options.bgColor.g},${options.bgColor.b})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = `rgba(${options.nameColor.r},${options.nameColor.g},${options.nameColor.b})`;
      context.font = `${options.nameFont.size}px ${options.nameFont.font}`;
      context.textAlign = 'center';
      context.fillText(
        props.name,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width - 10
      );
      if (props.bottlingDate != null) {
        context.font = `${options.dateFont.size}px ${options.dateFont.font}`;
        context.textAlign = 'center';
        context.fillStyle = `rgba(${options.dateColor.r},${options.dateColor.g},${options.dateColor.b})`;
        context.fillText(
          props.bottlingDate,
          canvas.width / 2,
          canvas.height / 2 + 15,
          canvas.width - 10
        );
      }
      context.save();

      const logo = new Image();
      logo.src = '../../logo.png';
      logo.onload = function () {
        context.translate(-logo.width / 2, -logo.height / 2);
        context.drawImage(logo, canvas.width / 2, canvas.height / 2 + 100);
        context.restore();
      };
    }
  }, [
    canvas,
    context,
    props.name,
    props.bottlingDate,
    img,
    bgColor.r,
    bgColor.g,
    bgColor.b,
    nameColor.r,
    nameColor.g,
    nameColor.b,
    dateColor.r,
    dateColor.g,
    dateColor.b,
    nameFont.size,
    nameFont.font,
    dateFont.size,
    dateFont.font,
    options.bgColor.r,
    options.bgColor.g,
    options.bgColor.b,
    options.nameColor.r,
    options.nameColor.g,
    options.nameColor.b,
    options.nameFont.size,
    options.nameFont.font,
    options.dateFont.size,
    options.dateFont.font,
    options.dateColor.r,
    options.dateColor.g,
    options.dateColor.b,
  ]);
  return (
    <Box>
      {labelId == null ? (
        <Button onClick={handleAddLabel}>Add Label</Button>
      ) : (
        <Box>
          {props.labelId == null ? (
            <Box>
              <Box display="flex">
                <canvas
                  ref={canvasRef}
                  id="labelEditor"
                  width="300"
                  height="424"
                  style={{ border: '1px solid black' }}
                ></canvas>
                <Box>
                  {img != null ? (
                    <Box>
                      <Button onClick={() => setImg(null)}>Remove image</Button>{' '}
                      <br />
                    </Box>
                  ) : (
                    <Box>
                      You can add one image to label by <br />
                      dragging and dropping it to
                      <br />
                      the editor.
                    </Box>
                  )}
                  <IconButton disabled={undos.length == 0} onClick={handleUndo}>
                    <UndoIcon />
                  </IconButton>
                  <IconButton disabled={redos.length == 0} onClick={handleRedo}>
                    <RedoIcon />
                  </IconButton>
                  <br />

                  <Box>
                    <FormLabel>{labels['LABEL_EDITOR_NAME']}</FormLabel>
                    <FormGroup row>
                      <TextField
                        label={labels['LABEL_EDITOR_RED']}
                        type="number"
                        value={options.nameColor.r}
                        onChange={(event) => {
                          event.preventDefault();
                          setNameColor({
                            r: event.target.value,
                            g: nameColor.g,
                            b: nameColor.b,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <TextField
                        label={labels['LABEL_EDITOR_GREEN']}
                        type="number"
                        value={options.nameColor.g}
                        onChange={(event) => {
                          event.preventDefault();
                          setNameColor({
                            r: nameColor.r,
                            g: event.target.value,
                            b: nameColor.b,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <TextField
                        label={labels['LABEL_EDITOR_BLUE']}
                        type="number"
                        value={options.nameColor.b}
                        onChange={(event) => {
                          event.preventDefault();
                          setNameColor({
                            r: nameColor.r,
                            g: nameColor.g,
                            b: event.target.value,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                    </FormGroup>
                    <FormLabel>{labels['LABEL_EDITOR_DATE']}</FormLabel>
                    <FormGroup row>
                      <TextField
                        label={labels['LABEL_EDITOR_RED']}
                        type="number"
                        value={options.dateColor.r}
                        onChange={(event) => {
                          event.preventDefault();
                          setDateColor({
                            r: event.target.value,
                            g: dateColor.g,
                            b: dateColor.b,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <TextField
                        label={labels['LABEL_EDITOR_GREEN']}
                        type="number"
                        value={options.dateColor.g}
                        onChange={(event) => {
                          event.preventDefault();
                          setDateColor({
                            r: dateColor.r,
                            g: event.target.value,
                            b: dateColor.b,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <TextField
                        label={labels['LABEL_EDITOR_BLUE']}
                        type="number"
                        value={options.dateColor.b}
                        onChange={(event) => {
                          event.preventDefault();
                          setDateColor({
                            r: dateColor.r,
                            g: dateColor.g,
                            b: event.target.value,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                    </FormGroup>
                    <FormLabel>{labels['LABEL_EDITOR_BG']}</FormLabel>
                    <FormGroup row>
                      <TextField
                        label={labels['LABEL_EDITOR_RED']}
                        type="number"
                        value={options.bgColor.r}
                        onChange={(event) => {
                          event.preventDefault();
                          setBgColor({
                            r: event.target.value,
                            g: bgColor.g,
                            b: bgColor.b,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <TextField
                        label={labels['LABEL_EDITOR_GREEN']}
                        type="number"
                        value={options.bgColor.g}
                        onChange={(event) => {
                          event.preventDefault();
                          setBgColor({
                            r: bgColor.r,
                            g: event.target.value,
                            b: bgColor.b,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <TextField
                        label={labels['LABEL_EDITOR_BLUE']}
                        type="number"
                        value={options.bgColor.b}
                        onChange={(event) => {
                          event.preventDefault();
                          setBgColor({
                            r: bgColor.r,
                            g: bgColor.g,
                            b: event.target.value,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                    </FormGroup>
                    <FormLabel>{labels['LABEL_EDITOR_NAME_FONT']}</FormLabel>
                    <FormGroup row>
                      <TextField
                        label={labels['LABEL_EDITOR_FONT_SIZE']}
                        type="number"
                        value={options.nameFont.size}
                        onChange={(event) => {
                          event.preventDefault();
                          setNameFont({
                            font: nameFont.font,
                            size: event.target.value,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <FormControl style={{ minWidth: 200 }}>
                        <InputLabel htmlFor="nameFont">
                          {labels['LABEL_EDITOR_FONT']}
                        </InputLabel>
                        <Select
                          id="nameFont"
                          value={options.nameFont.font}
                          onChange={(event) => {
                            event.preventDefault();
                            setNameFont({
                              font: event.target.value,
                              size: nameFont.size,
                            });
                            setChanged(true);
                          }}
                        >
                          {fonts.map((font, i) => (
                            <MenuItem
                              style={{ fontFamily: font }}
                              value={font}
                              key={i}
                            >
                              {font}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                    <FormLabel>{labels['LABEL_EDITOR_DATE_FONT']}</FormLabel>
                    <FormGroup row>
                      <TextField
                        label={labels['LABEL_EDITOR_FONT_SIZE']}
                        type="number"
                        value={options.dateFont.size}
                        onChange={(event) => {
                          event.preventDefault();
                          setDateFont({
                            font: dateFont.font,
                            size: event.target.value,
                          });
                          setChanged(true);
                        }}
                        style={{ width: 50 }}
                      />
                      <FormControl style={{ minWidth: 200 }}>
                        <InputLabel htmlFor="dateFont">
                          {labels['LABEL_EDITOR_FONT']}
                        </InputLabel>

                        <Select
                          id="nameFont"
                          value={options.dateFont.font}
                          onChange={(event) => {
                            event.preventDefault();
                            setDateFont({
                              font: event.target.value,
                              size: dateFont.size,
                            });
                            setChanged(true);
                          }}
                        >
                          {fonts.map((font, i) => (
                            <MenuItem
                              style={{ fontFamily: font }}
                              value={font}
                              key={i}
                            >
                              {font}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </FormGroup>
                  </Box>
                </Box>
              </Box>
              <Box>
                {props.labelId ? (
                  ''
                ) : (
                  <Button
                    onClick={() => {
                      saveLabel();
                      props.saveLabelId(labelId);
                    }}
                  >
                    Save label
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <img src={'../../img/labels/' + props.labelId + '.png'} />
              <br />
              <Button
                onClick={() => {
                  props.saveLabelId(null);
                  setLabelId(null);
                }}
              >
                Remove label
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  settings: state.settings,
  user: state.user,
});
export default connect(mapStateToProps)(EditLabel);
