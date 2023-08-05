import { Router } from "express";

interface Listener {
    listen(): Promise<void>;
}

export default Listener;