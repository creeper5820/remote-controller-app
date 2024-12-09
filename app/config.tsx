const developing: boolean = true;

const develop_backend_address: string = "10.31.0.35";
const production_backend_address: string = "10.10.10.10";

export const message_request_url: string | null =
    developing ? "http://" + develop_backend_address + ":14543"
        : "http://" + production_backend_address + ":14543";

export const remote_control_url: string | null =
    developing ? "http://" + develop_backend_address + ":16425"
        : "http://" + production_backend_address + ":16425";

export const user_control_url: string | null =
    developing ? "http://" + develop_backend_address + ":18764"
        : "http://" + production_backend_address + ":18764";