import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const read = path => readFileSync(new URL('../../'+path,import.meta.url),'utf8');
test('contact opens a vCard with explicit delivery metadata for phone contact import',()=>{
 const config=JSON.parse(read('vercel.json'));
 const rule=config.headers?.find(rule=>rule.source==='/connect/brandon-hoff.vcf');
 assert.ok(rule,'vCard delivery rule exists');
 assert.ok(rule.headers.some(header=>header.key==='Content-Type' && header.value==='text/vcard; charset=utf-8'));
 assert.match(read('public/connect/brandon-hoff.vcf'),/TITLE:Founder \+ Principal/);
 assert.match(read('public/connect/index.html'),/class="action" href="\/connect\/brandon-hoff.vcf"/);
});
