import { SubTriggerPipe } from './custom-pipes.pipe';

describe('CustomPipesPipe', () => {
  it('create an instance', () => {
    const pipe = new SubTriggerPipe();
    expect(pipe).toBeTruthy();
  });
});
