import { describe, it, expect, beforeAll, vi } from 'vitest';
import { fromDropEvent } from '../drag';

const data: Record<string, string> = {
  "text/uri-list": 'https://www.amazon.com/sspa/click?ie=UTF8&spc=MToxMDI5MDE0MTk1NDE4MjcwOjE3NDMzMTI5Mjg6c3BfZGV0YWlsOjMwMDY5ODg3NDA0NTMwMjo6Ojo&url=%2Fdp%2FB09GW71YT6%2Fref%3Dsspa_dk_detail_6%3Fpsc%3D1%26pd_rd_i%3DB09GW71YT6%26pd_rd_w%3DYWHsM%26content-id%3Damzn1.sym.8c2f9165-8e93-42a1-8313-73d3809141a2%26pf_rd_p%3D8c2f9165-8e93-42a1-8313-73d3809141a2%26pf_rd_r%3DF0BH83H9ZPQV31KAX5CR%26pd_rd_wg%3DmHcRw%26pd_rd_r%3D17c0f5c7-d222-4fc5-aeb8-e09d7c11b07c%26sp_csd%3Dd2lkZ2V0TmFtZT1zcF9kZXRhaWw',
  "text/html": '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><img alt="Brink of War: A Prosecution Force Thriller (The Prosecution Force Thrillers Book 1)" src="https://m.media-amazon.com/images/I/41BqDTjayAL.UX300_PJku-sticker-v7,TopRight,0,-50_AC_SF480,480_.jpg" class="a-dynamic-image" data-a-dynamic-image="{&quot;https://m.media-amazon.com/images/I/41BqDTjayAL.UX300_PJku-sticker-v7,TopRight,0,-50_AC_SF480,480_.jpg&quot;:[480,480]}" style="max-width:160px;max-height:160px;">'
}

const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
const fileList: FileList = [file].values() as unknown as FileList;
const fileData: Record<string, FileList> = {
  "Files": fileList,
}

describe('Test Drag', () => {
  let dragEvent: DragEvent;
  let dragEventWithFiles: DragEvent;

  beforeAll(() => {
    dragEvent = {
      dataTransfer: {
        types: Object.keys(data),
        getData: vi.fn().mockReturnValue((format: string) => data[format] || ''),
      }
    } as unknown as DragEvent;

    dragEventWithFiles = dragEventWithFiles = {
      dataTransfer: {
        _types: Object.keys(fileData),
        get types() {
          return this._types;
        },
        _files: fileData["Files"],
        get files() {
          return this._files;
        },
      }
    } as unknown as DragEvent;
  })

  it('should return items from the drag event', async () => {
    const items = await fromDropEvent(dragEvent);
    expect(dragEvent.dataTransfer?.getData).toHaveBeenCalled();
    expect(items.length).toEqual(2);
    expect(items.map((item) => item.type)).toEqual(Object.keys(data));
  });

  it('should return items from a file drag event', async () => {
    const typesSpy = vi.spyOn(dragEventWithFiles.dataTransfer as DataTransfer, 'types', 'get');
    const filesSpy = vi.spyOn(dragEventWithFiles.dataTransfer as DataTransfer, 'types', 'get');

    const items = await fromDropEvent(dragEventWithFiles);
    expect(typesSpy).toHaveBeenCalled();
    expect(filesSpy).toHaveBeenCalled();
    expect(items.length).toEqual(1);
    expect(items.map((item) => item.type)).toEqual(["Files"]);
    expect(JSON.stringify(items[0].data)).toEqual(JSON.stringify(dragEventWithFiles?.dataTransfer?.files));
  });
})
