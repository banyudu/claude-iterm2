export type HookEventName =
  | "UserPromptSubmit"
  | "PreToolUse"
  | "PostToolUse"
  | "PostToolUseFailure"
  | "Stop"
  | "Notification"
  | "PermissionRequest"
  | "SessionEnd";

export type Status = "idle" | "working" | "waiting" | "done" | "error";

export interface HookInput {
  hook_event_name: HookEventName;
  session_id?: string;
  tool_name?: string;
  notification_type?: string;
  is_interrupt?: boolean;
  stop_hook_active?: boolean;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface StatusConfig {
  color: RGB;
  badge: string;
  titlePrefix: string;
}
