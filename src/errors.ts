export class AppError extends Error{constructor(message:string, public code='APP_ERROR', public details?:unknown){super(message)}}
export class ProviderError extends AppError{constructor(message:string, details?:unknown){super(message,'PROVIDER_ERROR',details)}}
export class SafetyError extends AppError{constructor(message:string, details?:unknown){super(message,'SAFETY_ERROR',details)}}
