import { ErrorCode } from "./constants/error_codes";
import { BaseCMI } from "./cmi/common/base_cmi";
import { CommitObject, InternalSettings, LogLevel, RefObject, ResultObject, Settings } from "./types/api_types";
import { IBaseAPI } from "./interfaces/IBaseAPI";
export default abstract class BaseAPI implements IBaseAPI {
    private _timeout?;
    private readonly _error_codes;
    private _settings;
    protected constructor(error_codes: ErrorCode, settings?: Settings);
    abstract cmi: BaseCMI;
    startingData?: RefObject;
    currentState: number;
    lastErrorCode: string;
    listenerArray: any[];
    apiLogLevel: LogLevel;
    selfReportSessionTime: boolean;
    abstract reset(settings?: Settings): void;
    commonReset(settings?: Settings): void;
    initialize(callbackName: string, initializeMessage?: string, terminationMessage?: string): string;
    abstract lmsInitialize(): string;
    abstract lmsFinish(): string;
    abstract lmsGetValue(CMIElement: string): string;
    abstract lmsSetValue(CMIElement: string, value: any): string;
    abstract lmsCommit(): string;
    abstract lmsGetLastError(): string;
    abstract lmsGetErrorString(CMIErrorCode: string | number): string;
    abstract lmsGetDiagnostic(CMIErrorCode: string | number): string;
    abstract validateCorrectResponse(_CMIElement: string, _value: any): void;
    abstract getChildElement(_CMIElement: string, _value: any, _foundFirstIndex: boolean): BaseCMI | null;
    abstract storeData(_calculateTotalTime: boolean): Promise<ResultObject>;
    abstract renderCommitCMI(_terminateCommit: boolean): RefObject | Array<any>;
    abstract renderCommitObject(_terminateCommit: boolean): CommitObject;
    apiLog(functionName: string, logMessage: string, messageLevel: LogLevel, CMIElement?: string): void;
    get error_codes(): ErrorCode;
    get settings(): InternalSettings;
    set settings(settings: Settings);
    terminate(callbackName: string, checkTerminated: boolean): Promise<string>;
    getValue(callbackName: string, checkTerminated: boolean, CMIElement: string): string;
    setValue(callbackName: string, commitCallback: string, checkTerminated: boolean, CMIElement: string, value: any): string;
    commit(callbackName: string, checkTerminated?: boolean): Promise<string>;
    getLastError(callbackName: string): string;
    getErrorString(callbackName: string, CMIErrorCode: string | number): string;
    getDiagnostic(callbackName: string, CMIErrorCode: string | number): string;
    checkState(checkTerminated: boolean, beforeInitError: number, afterTermError: number): boolean;
    getLmsErrorMessageDetails(_errorNumber: string | number, _detail?: boolean): string;
    getCMIValue(_CMIElement: string): string;
    setCMIValue(_CMIElement: string, _value: any): string;
    _commonSetCMIValue(methodName: string, scorm2004: boolean, CMIElement: string, value: any): string;
    _commonGetCMIValue(methodName: string, scorm2004: boolean, CMIElement: string): any;
    isInitialized(): boolean;
    isNotInitialized(): boolean;
    isTerminated(): boolean;
    on(listenerName: string, callback: Function): void;
    off(listenerName: string, callback: Function): void;
    clear(listenerName: string): void;
    processListeners(functionName: string, CMIElement?: string, value?: any): void;
    throwSCORMError(errorNumber: number, message?: string): void;
    clearSCORMError(success: string): void;
    loadFromFlattenedJSON(json: RefObject, CMIElement?: string): void;
    loadFromJSON(json: RefObject, CMIElement?: string): void;
    renderCMIToJSONString(): string;
    renderCMIToJSONObject(): object;
    processHttpRequest(url: string, params: CommitObject | RefObject | Array<any>, immediate?: boolean): Promise<ResultObject>;
    scheduleCommit(when: number, callback: string): void;
    clearScheduledCommit(): void;
    private _checkObjectHasProperty;
    private handleValueAccessException;
    protected getCommitObject(terminateCommit: boolean): CommitObject | RefObject | Array<any>;
    private performFetch;
    private transformResponse;
}
