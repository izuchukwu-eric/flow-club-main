import DailyIframe from "@daily-co/daily-js";
import { child, onValue, set } from "@firebase/database";
import { useEffect, useRef, useState } from "react";
import {
  dailyParticipantInfo,
  makeParticipantUpdateHandler,
} from "../utils/daily";
import { db, firebaseSlugBase } from "../utils/firebase";
import { getRoomUrl } from "../utils/room";
import "./Call.css";
import Todo from "./Todo";
import TodoForms from "./TodoForms";

function Call({ firebaseApp }) {
  const callWrapperEl = useRef(null);
  const [participants, setParticipants] = useState({});

  const callFrame = useRef(null);
  useEffect(() => {
    const roomUrl = getRoomUrl();
    const frame = DailyIframe.createFrame(callWrapperEl.current, {
      url: roomUrl,
    });

    callFrame.current = frame;
    frame.join().then((frameParticipants) => {
      let newParticipants = {};
      for (const [id, participant] of Object.entries(frameParticipants)) {
        newParticipants[id] = dailyParticipantInfo(participant);
      }
      setParticipants(newParticipants);
    });

    frame.on(
      "participant-joined",
      makeParticipantUpdateHandler(setParticipants)
    );
    frame.on(
      "participant-updated",
      makeParticipantUpdateHandler(setParticipants)
    );
    frame.on("participant-left", makeParticipantUpdateHandler(setParticipants));

    return () => {
      callFrame.current.leave();
      callFrame.current.destroy();
    };
  }, []);

  // const [isEditingStatus, setIsEditingStatus] = useState(false);
  // const [currentStatus, setCurrentStatus] = useState("");
  const [todos, setTodos] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});

  useEffect(() => {
    const base = firebaseSlugBase();
    const statusesRef = child(base, "user_statuses");
    onValue(statusesRef, (snapshot) => {
      if (snapshot.val()) {
        setUserStatuses(snapshot.val());
      }
    });
  }, []);

  const localParticipant = Object.values(participants).find(
    (participant) => participant.isLocal
  );

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const newTodos = [todo, ...todos];

    setTodos(newTodos);
    const base = firebaseSlugBase();

    if (localParticipant) {
      const dbref = child(base, `user_statuses/${localParticipant?.id}`);
      set(dbref, todos);
      onValue(dbref, (snapshot) => {
        if (snapshot.val()) {
          console.log(snapshot.val());
        }
      });
    }
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const removeTodo = (id) => {
    const removeArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removeArr);
  };

  // const finishEditing = () => {
  //   const base = firebaseSlugBase();
  //   setIsEditingStatus(false);
  //   if (localParticipant) {
  //     set(child(base, `user_statuses/${localParticipant.id}`), currentStatus);
  //   }
  // };

  return (
    <div style={{ height: "100vh", minWidth: "100vh", display: "flex" }}>
      <div
        id="call"
        ref={callWrapperEl}
        style={{ height: "100%", width: "70%" }}
      />
      <div style={{ width: "30%", padding: "10px" }}>
        <h2>Statuses</h2>
        <h3>My Status</h3>
        {localParticipant && <p>name: {localParticipant?.name}</p>}
        <TodoForms onSubmit={addTodo} />
        <Todo
          todos={todos}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
        {/* {isEditingStatus ? (
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <textarea
                            rows={4}
                            onChange={(ev) => setCurrentStatus(ev.target.value)}
                            onBlur={() => finishEditing()}
                            value={currentStatus}
                        />
                        <p onBlur={() => finishEditing()} className='cursor-pointer'>✔️</p>
                    </div>
                ) : (
                    <div className='cursor-pointer' onClick={() => setIsEditingStatus(true)}>
                        {currentStatus ? currentStatus.split('\n').map((v, i) => (
                            <p key={v + i}>{i === 0 && '✏️'}{v}</p>
                        )) : (
                            <p>✏️&lt;empty&gt;</p>

                        )}
                    </div>
                )} */}
        <h3>Other Statuses</h3>
        {Object.entries(participants)
          .filter(([_, info]) => info.id !== localParticipant?.id)
          .map(([id, info]) => (
            <div key={id} style={{ border: "1px solid gray" }}>
              <p>
                <strong>name:</strong> {info.name}
              </p>
              <p>
                <strong>status:</strong>
                {!(id in userStatuses) && "<empty>"}
              </p>
              {id in userStatuses &&
                userStatuses[id]
                  .split("\n")
                  .map((v, i) => <p key={v + i}>{v}</p>)}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Call;
