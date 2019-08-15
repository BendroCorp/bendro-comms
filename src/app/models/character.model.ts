export class Character {
  id?:number;
  user_id?:number;
  first_name?:string;
  nickname?:string;
  last_name?:string;
  full_name?:string;
  description?:string;
  background?:string;

  avatar_url?:string;
  current_job_level?: number
  current_job?:Job
  jobs?:Job[]
  rsi_handle?:string
}

export class Job {
  id?: number
  title?: string
  description?: string
  hiring_description?: string
  recruit_job_id?: number
  next_job_id?: number
  division_id?: number
  hiring?: boolean
  job_level_id?: number
  max?: number
}