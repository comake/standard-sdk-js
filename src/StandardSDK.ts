export interface StandardSdkArgs {
  apiSpecs?: Record<string, string>;
  skqlConfig?: Record<string, string>;
}

export class StandardSDK {
  private readonly apiSpecs?: Record<string, string>;

  public constructor(args: StandardSdkArgs) {
    this.apiSpecs = args.apiSpecs;
  }
}
