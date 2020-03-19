import { Button, IconButton, TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Delete from "@material-ui/icons/Delete";
import FileCopy from "@material-ui/icons/FileCopy";
import * as React from "react";
import { useState } from "react";
import { render } from "react-dom";
import "./styles.css";
import usePersistedState from "./usePersistedState";
import Tooltip from "@material-ui/core/Tooltip";
import { Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

interface IPassword {
  [key: string]: string;
}
interface IAppProps {
  passwords?: {};
}

const App: React.FC<IAppProps> = () => {
  let [passwords, setPasswords] = usePersistedState<IPassword>("passwords", {});
  let [passwordsDeleted, setPasswordsDeleted] = usePersistedState<IPassword>(
    "passwordsDeleted",
    {}
  );

  const [name, setName] = useState();
  const [password, setPassword] = useState();

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const deleteHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: string
  ) => {
    event.preventDefault();

    setPasswordsDeleted(
      Object.assign(
        {
          [key + " " + Date.now()]: passwords[key]
        },
        passwordsDeleted
      )
    );
    delete passwords[key];
    setPasswords(Object.assign({}, passwords));
    console.log(window.localStorage);
  };

  const copyHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    pass: string
  ) => {
    event.preventDefault();
    navigator.clipboard.writeText(pass);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswords(
      Object.assign(
        {
          [name]: password
        },
        passwords
      )
    );
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography>Enter new password</Typography>

          <form autoComplete="off" onSubmit={e => submitHandler(e)}>
            <TextField label="Name" fullWidth onInput={nameHandler} />
            <br />
            <TextField
              fullWidth
              type="password"
              label="Password"
              onInput={passwordHandler}
              autoComplete="new-password"
            />
            <br />
            <br />
            <div style={{ textAlign: "right" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <br />
      <br />

      <Card>
        <CardContent>
          <Typography>Registered Passwords</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Password</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(passwords).map(key => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell align="center">
                      {passwords[key]}
                      <Tooltip title="Copy">
                        <IconButton
                          aria-label="Copy"
                          onClick={e => copyHandler(e, passwords[key])}
                        >
                          <FileCopy />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={e => deleteHandler(e, key)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

render(<App />, document.getElementById("root"));
