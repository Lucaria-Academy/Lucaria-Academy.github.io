'use strict';
const {gallery, edits, sequences} = window.UNISPARK;
const $ = (selector) => document.querySelector(selector);
function activate(button, selector) {
  document.querySelectorAll(selector).forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
}
const GALLERY_PAGE_SIZE = 18;
let galleryFilter = 'All';
let galleryLimit = GALLERY_PAGE_SIZE;
$('#gallery-grid').innerHTML = gallery.map(item => `<div class="gallery-item" data-category="${item.category}"><img src="assets/${item.name}.jpg" alt="${item.title}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"><span class="gallery-caption"><span>${item.title}</span><small>${item.category}</small></span></div>`).join('');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
const galleryMore = $('#gallery-more');
function renderGallery() {
  let matches = 0;
  galleryItems.forEach(item => {
    const matchesFilter = galleryFilter === 'All' || item.dataset.category === galleryFilter;
    item.hidden = !matchesFilter || matches >= galleryLimit;
    if (matchesFilter) matches++;
  });
  const shown = Math.min(matches, galleryLimit);
  $('#gallery-status').textContent = `Showing ${shown} of ${matches} ${matches === 1 ? 'image' : 'images'}`;
  galleryMore.hidden = matches <= GALLERY_PAGE_SIZE;
  galleryMore.textContent = shown < matches ? `Show ${Math.min(GALLERY_PAGE_SIZE, matches - shown)} more` : 'Show fewer';
  galleryMore.setAttribute('aria-expanded', String(galleryLimit > GALLERY_PAGE_SIZE));
}
document.querySelectorAll('[data-filter]').forEach(button => {
  const category = button.dataset.filter;
  const count = category === 'All' ? gallery.length : gallery.filter(item => item.category === category).length;
  const label = category === 'All' ? 'All images' : category;
  button.innerHTML = `${label}<span class="filter-count" aria-hidden="true">${count}</span>`;
  button.setAttribute('aria-label', `${label}, ${count} ${count === 1 ? 'image' : 'images'}`);
  button.addEventListener('click', () => {
    activate(button, '[data-filter]');
    galleryFilter = category;
    galleryLimit = GALLERY_PAGE_SIZE;
    renderGallery();
  });
});
galleryMore.addEventListener('click', () => {
  const total = galleryFilter === 'All' ? gallery.length : gallery.filter(item => item.category === galleryFilter).length;
  const collapse = galleryLimit >= total;
  galleryLimit = collapse ? GALLERY_PAGE_SIZE : galleryLimit + GALLERY_PAGE_SIZE;
  renderGallery();
  if (collapse) $('#gallery').scrollIntoView({block: 'start'});
});
renderGallery();
const originalEditLabels = {'coat': 'Coat color', 'perfume-edit': 'Perfume color', 'teahouse': 'Season change', 'dessert-red': 'Dessert glaze'};
const editLabels = edits.map(item => item.title || originalEditLabels[item.name] || item.name);
$('.edit-sidebar h3').textContent = `Image editing · ${edits.length} examples`;
$('#edit-options').innerHTML = edits.map((item,i) => `<button data-edit="${i}" aria-pressed="${i===0}" class="${i===0?'active':''}">${editLabels[i]}</button>`).join('');
function setComparison(value) {
  $('#comparison').style.setProperty('--position', `${value}%`);
  $('#compare-range').setAttribute('aria-valuetext', `${value} percent source image`);
}
function selectEdit(index) {
  const item = edits[index];
  $('#edit-before').src = `assets/${item.name}-before.jpg`;
  $('#edit-before').alt = `Source image for ${editLabels[index].toLowerCase()}`;
  $('#edit-after').src = `assets/${item.name}-after.jpg`;
  $('#edit-after').alt = `Edited image: ${item.description}`;
  $('#edit-description').textContent = item.description;
  const credit = $('#edit-credit');
  credit.hidden = !item.sourceUrl;
  const sourceLink = credit.querySelector('a');
  sourceLink.textContent = item.sourceCredit || '';
  if (item.sourceUrl) sourceLink.href = item.sourceUrl;
  else sourceLink.removeAttribute('href');
  $('#compare-range').value = 50;
  setComparison(50);
  activate(document.querySelector(`[data-edit="${index}"]`), '[data-edit]');
}
document.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => selectEdit(Number(button.dataset.edit))));
$('#compare-range').addEventListener('input', event => setComparison(event.target.value));
selectEdit(0);
let sequenceIndex = 0;
$('#sequence-options').innerHTML = sequences.map((item,i) => `<button data-sequence="${i}" aria-pressed="${i===0}" class="${i===0?'active':''}">${item.title}</button>`).join('');
function selectSequence(index) {
  sequenceIndex = (index + sequences.length) % sequences.length;
  const item = sequences[sequenceIndex];
  const activeButton = document.querySelector(`[data-sequence="${sequenceIndex}"]`);
  activate(activeButton, '[data-sequence]');
  const options = $('#sequence-options');
  const optionsRect = options.getBoundingClientRect();
  const buttonRect = activeButton.getBoundingClientRect();
  if (buttonRect.left < optionsRect.left) {
    options.scrollLeft += buttonRect.left - optionsRect.left;
  } else if (buttonRect.right > optionsRect.right) {
    options.scrollLeft += buttonRect.right - optionsRect.right;
  }
  $('#sequence-description').textContent = item.description;
  $('#sequence-frames').innerHTML = [1,2,3,4].map(n => {
    const caption = item.frameLabels?.[n-1];
    const alt = caption ? `${item.title}, image ${n} of 4: ${caption}` : `${item.title}, successive image ${n} of 4`;
    return `<div class="sequence-frame"><img src="assets/${item.name}-${n}.jpg" alt="${alt}" width="${item.width || 576}" height="${item.height || 384}" loading="lazy" decoding="async"><span>${caption ? `${n}. ${caption}` : `Image ${n}`}</span></div>`;
  }).join('');
}
document.querySelectorAll('[data-sequence]').forEach(button => button.addEventListener('click', () => selectSequence(Number(button.dataset.sequence))));
$('#previous-sequence').addEventListener('click', () => selectSequence(sequenceIndex-1));
$('#next-sequence').addEventListener('click', () => selectSequence(sequenceIndex+1));
selectSequence(0);
const resultRows = window.UNISPARK_RESULT_ROWS;
const benchmarkLink = (label, url) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
const generationSettings = [
  ['Training stage', 'UniSpark scores are obtained after unified supervised fine-tuning (SFT).'],
  ['Baselines', 'Published generation scores follow the comparison in LLaDA2.0-Uni and retain their source evaluation settings. BAGEL uses direct generation, without external prompt rewriting.'],
  ['Architecture', 'AR: autoregressive; CD: continuous diffusion; DD: discrete diffusion. A plus sign denotes combined architectures.']
];
const efficiencySettings = [
  ['Hardware', 'One dedicated H20-3e GPU per model, BF16, batch size 1, with all model components resident on the GPU. MoT parameter counts are per branch.'],
  ['Measurement', 'Five warm-up runs, followed by four input cases repeated three times: 12 measured runs per setting. Latency and throughput are medians; memory is the maximum allocated GPU memory. Model loading and disk I/O are excluded.'],
  ['Comparison scope', 'These are system-level measurements. Model sizes, native tokenization, vision encoders, and implementations differ, so the results do not isolate the effect of hybrid attention.']
];
const results = {
  understanding: {
    heading: 'Perception, reasoning, and visual mathematics',
    intro: 'Six benchmark families cover complementary understanding skills. MME is reported as both perception (MME-P) and perception plus cognition (MME-S).',
    stats: [['2470.3','MME-S'],['86.7','MMBench'],['77.2','MathVista']],
    title: 'Selected understanding results · higher is better',
    headers: ['Model','Type','LLM params','MME-P','MME-S','MMBench','MMMU','MM-Vet','MathVista','MMVP'],
    rows: resultRows.understanding.filter(r => ['Qwen3.5-9B','MetaQuery-XL†','SenseNova-U1','UniSpark'].includes(r[0]) || (r[0]==='BAGEL' && r[2]==='7B MoT')),
    fullRows: resultRows.understanding,
    analysis: 'UniSpark scores above BAGEL (7B MoT) across all six benchmark families, including +6.2 points on MM-Vet and +4.1 on MathVista. The remaining gaps are task dependent: MetaQuery-XL scores 58.6 on MMMU versus 56.7 for UniSpark, while Qwen3.5-9B is higher on MM-Vet and MathVista.',
    note: 'MMBench answer extraction differs: UniSpark uses rules only; Qwen3.5 and SenseNova-U1 use a Qwen fallback. MoT counts are per branch, and MoE counts are active/total. † Frozen Qwen2.5-VL backbone. ** Scores taken from MetaMorph or MetaQuery in the source comparison. — Unreported.',
    settings: [
      ['Evaluation', 'MMBench v1.0-dev-en uses circular accuracy. MMMU reports validation accuracy without chain-of-thought prompting. MMVP reports paired accuracy.'],
      ['Benchmark coverage', `${benchmarkLink('MME','https://arxiv.org/abs/2306.13394v1')} evaluates perception and cognition; ${benchmarkLink('MMBench','https://arxiv.org/abs/2307.06281')} and ${benchmarkLink('MM-Vet','https://proceedings.mlr.press/v235/yu24o.html')} cover visual question answering and integrated capabilities. ${benchmarkLink('MMMU','https://openaccess.thecvf.com/content/CVPR2024/html/Yue_MMMU_A_Massive_Multi-discipline_Multimodal_Understanding_and_Reasoning_Benchmark_for_CVPR_2024_paper.html')} tests subject-level reasoning; ${benchmarkLink('MathVista','https://arxiv.org/abs/2310.02255')} covers visual mathematics; ${benchmarkLink('MMVP','https://arxiv.org/abs/2401.06209')} tests fine-grained visual discrimination.`],
      ['Score sources', 'Understanding baselines come from the BAGEL comparison and additional Qwen3.5 and SenseNova-U1 evaluations. Published settings are retained; model and protocol differences should be considered when reading the scores.']
    ]
  },
  geneval: {
    heading:'Object and composition control',
    intro:'GenEval separates object presence, counting, color, spatial position, and attribute binding. Scores range from 0 to 1; higher is better.',
    stats:[['0.83','Overall'],['0.99','Single object'],['0.94','Colors']],
    title:'GenEval category scores',
    headers:['Model','Type','Architecture','Single object','Two objects','Counting','Colors','Position','Attribute binding','Overall'],
    rows:resultRows.geneval.filter(r=>['BAGEL','OmniGen2','Lumina-DiMOO','LLaDA2.0-Uni','UniSpark'].includes(r[0])),
    fullRows:resultRows.geneval,
    analysis:'UniSpark reaches 0.83 overall, close to BAGEL’s 0.82. Single objects (0.99), colors (0.94), and two objects (0.93) are its strongest categories. Counting (0.68), position (0.67), and attribute binding (0.73) remain more difficult. Lumina-DiMOO and LLaDA2.0-Uni achieve higher overall scores, leaving room to improve compositional control.',
    note:'UniSpark and BAGEL combine autoregressive text modeling with continuous diffusion for images.',
    settings:[['Benchmark',benchmarkLink('GenEval paper','https://arxiv.org/abs/2310.11513')+' — object-focused evaluation of text-to-image alignment.'],...generationSettings]
  },
  dpg: {
    heading:'Following detailed prompts',
    intro:'DPG-Bench evaluates global prompt alignment and entity, attribute, and relation details. It uses a different scoring scale from GenEval.',
    stats:[['80.54','Overall'],['82.62','Entity'],['76.71','Relation']],
    title:'DPG-Bench category scores · higher is better',
    headers:['Model','Type','Architecture','Global','Entity','Attribute','Relation','Other','Overall'],
    rows:resultRows.dpg.filter(r=>['BAGEL','OmniGen2','Lumina-DiMOO','LLaDA2.0-Uni','UniSpark'].includes(r[0])),
    fullRows:resultRows.dpg,
    analysis:'UniSpark scores 80.54 overall, below BAGEL (85.07) and LLaDA2.0-Uni (87.76). Entity is its strongest category at 82.62; attribute (77.07), relation (76.71), and other (73.50) scores are lower. Together with GenEval, this points to attribute and relational control as areas for improvement.',
    note:'The reported overall score is a benchmark aggregate, not a simple average of the displayed categories.',
    settings:[['Benchmark',benchmarkLink('ELLA / DPG-Bench paper','https://arxiv.org/abs/2403.05135')+' — evaluation of detailed prompt following.'],...generationSettings]
  },
  editing: {
    heading:'Requested changes and content preservation',
    intro:'ImgEdit evaluates instruction-based edits across nine categories. UniSpark is evaluated on all 737 benchmark samples.',
    stats:[['3.13','Overall reference score'],['4.05','Style'],['737','Samples evaluated']],
    title:'UniSpark ImgEdit reference scores · higher is better',
    headers:['Editing category','Score'],
    rows:['Add','Adjust','Extract','Replace','Remove','Background','Style','Hybrid','Action','Overall'].map((name,i)=>[name,resultRows.editing[9][i+2]]),
    fullRows:resultRows.editing,
    fullHeaders:['Model','Type','Add','Adjust','Extract','Replace','Remove','Background','Style','Hybrid','Action','Overall'],
    fullTitle:'Published editing baselines and UniSpark reference scores · different judges',
    fullLabel:'View published baselines (different judges)',
    analysis:'Style editing is strongest at 4.05, followed by object addition at 3.72. Extraction (1.68) and hybrid editing (1.62) are the weakest categories under the current evaluator. This breakdown captures differences that the overall score alone does not show.',
    note:'UniSpark uses Qwen3-VL-235B-A22B-Thinking as judge. Published baselines use a different evaluator, so these reference scores do not establish a direct model ranking. † Marks the different judge in the expanded table.',
    settings:[['Benchmark',benchmarkLink('ImgEdit paper','https://arxiv.org/abs/2505.20275')+' — evaluates whether requested changes are made while unrelated content is preserved.'],['Evaluation','All 737 samples are scored using Qwen3-VL-235B-A22B-Thinking. The table reports all nine editing categories and the overall reference score.'],['Baselines','Published baseline scores follow LLaDA2.0-Uni. The expanded table retains them for reference, with the evaluator difference explicitly marked.']]
  },
  generation_efficiency: {
    heading:'Generation latency and memory across resolutions',
    intro:'Matched output resolutions and sampling workloads reveal how generation cost changes from 512 × 512 to 2048 × 2048.',
    stats:[['14.16 s','UniSpark at 1024²'],['3.23×','Speedup over BAGEL at 1024²'],['62.74 GB','UniSpark peak memory at 2048²']],
    title:'Image generation efficiency',
    headers:['Resolution','Model','LLM params','Image tokens/s ↑','Median (s) ↓','P95 (s) ↓','Peak memory (GB) ↓'],
    rows:resultRows.generation_efficiency,
    analysis:'UniSpark is 1.62× faster than BAGEL at 512² and 3.23× faster at 1024². SenseNova-U1 is faster at both smaller settings; UniSpark becomes faster at 2048² (51.48 vs. 58.34 s), with higher peak allocated memory (62.74 vs. 37.39 GB). The latency advantage therefore comes with a memory cost.',
    note:'Image-token rates depend on representation size. At 1024², BAGEL uses 4,096 image tokens while UniSpark and SenseNova-U1 use 1,024. SenseNova-U1’s smaller settings lie outside its recommended resolution buckets; fixed workloads do not imply matched image quality. P95 is descriptive over 12 runs. — Unreported.',
    settings:[...efficiencySettings,['Sampling','Identical prompts, 49 sampling updates, and 79 denoising forwards. Text CFG is 4 over noise levels (0.4, 1.0], time shift is 1, and CFG normalization is disabled. The interval is mapped to each model’s native time coordinate.'],['Timing scope','Text prefill, denoising, VAE decoding where applicable, and CPU image conversion. Image tokens/s is the final spatial token count divided by end-to-end latency; repeated denoising forwards do not count as new tokens.']]
  },
  understanding_efficiency: {
    heading:'Understanding latency at matched visual-token budgets',
    intro:'Each model processes the same four image–question pairs and makes exactly 128 greedy token predictions at visual budgets of 256 or 1,024 tokens.',
    stats:[['22.19','UniSpark decode tokens/s at 1,024'],['6.02 s','UniSpark total latency at 1,024'],['36.03 GB','UniSpark peak memory at 1,024']],
    title:'Visual understanding efficiency · 128 output tokens',
    headers:['Visual tokens','Model','LLM params','Input resolution','Decode tokens/s ↑','First logits (s) ↓','Median (s) ↓','Peak memory (GB) ↓'],
    rows:resultRows.understanding_efficiency,
    analysis:'UniSpark falls between BAGEL and SenseNova-U1 in decoding throughput and total latency at both visual budgets. Increasing its visual budget from 256 to 1,024 tokens changes total latency from 5.94 to 6.02 s, while first-logit latency rises from 0.143 to 0.292 s. Decoding accounts for most of the fixed 128-token request time. BAGEL remains faster and uses less memory.',
    note:'First-logit latency ends before token selection; it is not user-visible time to first token. These measurements describe computational cost rather than answer quality.',
    settings:[...efficiencySettings,['Inputs and outputs','Visual-token counts are checked at the language-model input. BAGEL receives 224² or 448² images; UniSpark and SenseNova-U1 receive 512² or 1024² images. Early termination is ignored. Native tokenizers and chat templates are retained, and any reasoning text counts toward the 128-token output budget.'],['Timing scope','Images are loaded and resized before timing. Total latency includes native preprocessing, vision encoding, multimodal prefill, and text decoding. Decoding throughput is 127 / (t₁₂₈ − t₁), with CUDA events recorded after each output projection.']]
  }
};
function resultTable(title, headers, rows) {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="${title}"><table><caption>${title}</caption><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr class="${row.some(v=>v.startsWith('UniSpark'))?'ours':''}"><th scope="row">${row[0]}</th>${row.slice(1).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function showResult(key) {
  const data = results[key];
  $('#results-panel').innerHTML = `<div class="experiment-intro"><h3>${data.heading}</h3><p>${data.intro}</p></div>
    <dl class="result-highlights">${data.stats.map(([value,label])=>`<div><dt>${label}</dt><dd>${value.replace(/ (s|GB)$/, ' <span>$1</span>')}</dd></div>`).join('')}</dl>
    ${resultTable(data.title,data.headers,data.rows)}
    <div class="result-reading"><h4>What the results show</h4><p>${data.analysis}</p></div>
    <p class="result-note">${data.note}</p>
    <details class="experiment-details"><summary>Evaluation settings and sources <span aria-hidden="true">+</span></summary><dl class="experiment-settings">${data.settings.map(([label,body])=>`<div><dt>${label}</dt><dd>${body}</dd></div>`).join('')}</dl></details>
    ${data.fullRows?`<details class="experiment-details"><summary>${data.fullLabel || `View all ${data.fullRows.length} model entries from the paper`} <span aria-hidden="true">+</span></summary>${resultTable(data.fullTitle || data.title.replace('Selected ','All '),data.fullHeaders||data.headers,data.fullRows)}</details>`:''}`;
}
document.querySelectorAll('[data-result]').forEach(button => button.addEventListener('click', () => {activate(button,'[data-result]');showResult(button.dataset.result);}));
showResult('understanding');
$('#copy-citation').addEventListener('click', async () => {
  const text = $('#citation').textContent;
  try {
    await navigator.clipboard.writeText(text);
    $('#copy-status').textContent = 'BibTeX copied to clipboard.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();range.selectNodeContents($('#citation'));
    selection.removeAllRanges();selection.addRange(range);
    $('#copy-status').textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
  }
});

// Keep the section navigation in sync without moving focus or changing the URL.
const sectionLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const navSections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
let navFramePending = false;
function updateSectionNavigation() {
  const threshold = document.querySelector('.topbar').getBoundingClientRect().height + 120;
  let active = -1;
  navSections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= threshold) active = index;
  });
  sectionLinks.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navFramePending = false;
}
window.addEventListener('scroll', () => {
  if (!navFramePending) {
    navFramePending = true;
    requestAnimationFrame(updateSectionNavigation);
  }
}, {passive:true});
window.addEventListener('resize', updateSectionNavigation);
updateSectionNavigation();
