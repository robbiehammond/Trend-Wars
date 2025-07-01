import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Card from "@mui/material/Card";
import "./Chat.css";
function Chat() {
	return (
		<Card className="my-4 !bg-[#908fbb] h-[370px] flex flex-col">
			<Stack spacing={2} className="text-left overflow-y-scroll p-4">
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
				<div>Foobar: lorem ipsumn asdfja sdfkj asdflk.</div>
			</Stack>
			<div className=" flex px-2 py-2 gap-2">
				<TextField fullWidth variant="filled" autoComplete="off"></TextField>
				<Button variant="contained" endIcon={<SendIcon />}>
					Send
				</Button>
			</div>
		</Card>
	);
}

export default Chat;
