import React, { useEffect, useRef, useState } from "react";
import "./TimePicker.css";
import moment from "moment";

export default function TimePicker({ initialValue, onChange }: any) {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const amRef = useRef(null);
  const refs = [hourRef, minuteRef, amRef];
  const [time, setTime] = React.useState("--:-- am");
  const [currentFocus, setCurrentFocus] = useState(0);
  const [currentHour, setCurrentHour] = useState("");
  const [currentMinute, setCurrentMinute] = useState("");
  //   const [hour, setHour] = useState("");
  //   const [minute, setMinute] = useState("");
  useEffect(() => {
    // console.log("time changed", time);
    if (time !== initialValue && time !== "--:-- am") {
      console.log("time changed", time);
      onChange(time);
    }
  }, [time]);
  useEffect(() => {
    // console.log("initial val", initialValue);
    if (initialValue) {
      setTime(moment(initialValue, ["h:mm a"]).format("h:mm a"));
    } else {
      setTime("--:-- am");
    }
  }, [initialValue]);
  const focus = (index: number) => {
    if (index >= 0 && index < 3) {
      // @ts-ignore
      refs[index].current.focus();
    }
  };
  const keyPressed = (key: any) => {
    switch (key) {
      case "ArrowRight":
        focus(currentFocus + 1);
        break;
      case "ArrowLeft":
        focus(currentFocus - 1);
        break;
      case "P":
      case "p":
        setTime(time.replace("a", "p"));
        break;
      case "A":
      case "a":
        setTime(time.replace("p", "a"));
        break;
      case ":":
        focus(1);
        break;
      case "Backspace":
        onChange(null);
        break;
    }
  };
  const onMinuteChange = (value: string) => {
    if (value.split("").some((v) => !"0123456789".includes(v))) {
      return;
    }
    if (value.length == 1) {
      if (parseInt(value) > 5) {
        focus(2);
        setCurrentMinute("");
        setTime(time.split(":")[0] + ":0" + value + " " + time.split(" ")[1]);
      } else {
        setCurrentMinute(0 + value);
        // setMinute("0" + value);
        setTime(time.split(":")[0] + ":0" + value + " " + time.split(" ")[1]);
      }
    } else if (value.length == 2) {
      if (parseInt(value) > 59) return;
      setTime(time.split(":")[0] + ":" + value + " " + time.split(" ")[1]);
      //   setMinute(value);
      focus(2);
      setCurrentMinute("");
    } else if (value.length == 3) {
      setTime(
        time.split(":")[0] +
          ":" +
          value[1] +
          value[2] +
          " " +
          time.split(" ")[1]
      );
      //   setMinute(value[1] + value[2]);
      focus(2);
      setCurrentMinute("");
    }
  };
  const onHourChange = (value: string) => {
    if (value.split("").some((v) => !"0123456789".includes(v))) {
      return;
    }
    if (value.length == 1) {
      if (value === "0") {
        return;
      } else if (value !== "1") {
        focus(1);
        setCurrentHour("");
        // setHour(value);
      } else {
        setCurrentHour("1");
        // setHour("1");
      }
      setTime(value + ":" + time.split(":")[1]);
    } else {
      if (parseInt(value) < 13) {
        setTime(value + ":" + time.split(":")[1]);
        // setHour(value);
        focus(1);
      } else {
        focus(1);
        setCurrentMinute(0 + value[value.length - 1]);
        // setMinute(0 + value[value.length - 1]);
      }

      setCurrentHour("");
    }
  };

  return (
    <div style={{ border: "1px solid #aaa", borderRadius: "4px" }}>
      <div style={{ display: "flex" }} onKeyDown={(e) => keyPressed(e.key)}>
        <input
          className="time-input"
          ref={hourRef}
          value={currentHour}
          style={{
            width: "16px",
            caretColor: "transparent",
          }}
          onFocus={() => {
            setCurrentFocus(0);
            // setCurrentHour("");
          }}
          placeholder={time.split(":")[0]}
          onBlur={() => {
            setCurrentHour("");
          }}
          onChange={(e) =>
            e.target.value.length > currentHour.length &&
            onHourChange(e.target.value)
          }
          onKeyPress={(e) => keyPressed(e.key)}
        />
        :
        <input
          className="time-input"
          ref={minuteRef}
          value={currentMinute}
          style={{ width: "16px", caretColor: "transparent" }}
          onFocus={() => {
            setCurrentFocus(1);
            setCurrentMinute("");
          }}
          placeholder={time.split(":")[1].split(" ")[0]}
          onBlur={() => {
            setCurrentMinute("");
          }}
          onChange={(e) =>
            e.target.value.length > currentMinute.length &&
            onMinuteChange(e.target.value)
          }
          onKeyPress={(e) => keyPressed(e.key)}
        />
        <input
          className="time-input"
          onFocus={() => setCurrentFocus(2)}
          ref={amRef}
          value={time.split(" ")[1]}
          onChange={() => {}}
          placeholder={time.split(" ")[1]}
          style={{ width: "20px", caretColor: "transparent" }}
        />
      </div>
    </div>
  );
}
