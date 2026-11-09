import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Check, AlertTriangle, LogOut, ExternalLink, Lock, Upload, Trash2 } from 'lucide-react';
import { fetchContent, loginAdmin, saveContent, changePassword, uploadImage, errorMessage } from '../api.js';
import { DEFAULT_CONTENT } from '../defaults.js';

const TOKEN_KEY = 'pit500_admin_token';

const storage = {
  get: () => {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (v) => {
    try {
      window.localStorage.setItem(TOKEN_KEY, v);
    } catch {
      /* storage blocked: session lasts until reload */
    }
  },
  clear: () => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

const inputClass =
  'w-full border border-white/20 bg-asphalt px-4 py-3 text-white placeholder-ash/60 transition-colors duration-300 focus:border-accent focus:outline-none aria-[invalid=true]:border-red-500';

function Field({ id, label, value, onChange, error, hint, multiline = false, rows = 3, type = 'text', ...rest }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-white">
        {label}
      </label>
      <Tag
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={inputClass}
        {...(multiline ? { rows } : { type })}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ash">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------------------- Image field ---------------------------- */
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

// A link box plus an Upload button and drop zone. Uploading fills the link box with the hosted image.
function ImageField({ id, label, value, onChange, error, hint, token, onExpired, placeholder = 'https://...' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState({ type: '', text: '' });
  const [dragging, setDragging] = useState(false);
  const [previewBroken, setPreviewBroken] = useState(false);

  useEffect(() => {
    setPreviewBroken(false);
  }, [value]);

  const upload = async (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      setNote({ type: 'error', text: 'Choose a JPG, PNG, WebP or AVIF image.' });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setNote({ type: 'error', text: 'Image is larger than 8 MB. Choose a smaller file.' });
      return;
    }
    setBusy(true);
    setProgress(0);
    setNote({ type: '', text: '' });
    try {
      const { url } = await uploadImage(token, file, setProgress);
      onChange(url);
      setNote({ type: 'ok', text: 'Uploaded. Click Publish Live Updates to show it on the site.' });
    } catch (err) {
      if (err?.response?.status === 401) {
        onExpired();
        return;
      }
      setNote({ type: 'error', text: errorMessage(err, 'Upload failed. Try again.') });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!busy) upload(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <Field id={id} label={label} type="url" value={value} onChange={onChange} error={error} hint={hint} placeholder={placeholder} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mt-3 flex flex-wrap items-center gap-4 border border-dashed p-3 transition-colors duration-300 ${
          dragging ? 'border-accent bg-accent/10' : 'border-white/20'
        }`}
      >
        {value && !previewBroken ? (
          <img
            src={value}
            alt=""
            onError={() => setPreviewBroken(true)}
            className="h-20 w-28 border border-white/10 object-cover"
          />
        ) : (
          <div className="carbon flex h-20 w-28 items-center justify-center border border-white/10 text-xs text-ash">No image</div>
        )}

        <div className="min-w-[12rem] flex-1">
          <input
            ref={inputRef}
            id={`${id}-file`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => upload(e.target.files?.[0])}
            disabled={busy}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 border-2 border-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-accent transition-all duration-300 hover:bg-accent hover:text-black disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Upload size={16} aria-hidden="true" />}
              {busy ? (progress >= 100 ? 'Processing' : `Uploading ${progress}%`) : 'Upload image'}
            </button>
            {value && !busy && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setNote({ type: '', text: '' });
                }}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-ash transition-colors duration-300 hover:text-red-400"
              >
                <Trash2 size={14} aria-hidden="true" /> Remove
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-ash">Drop a file here or choose one. JPG, PNG, WebP or AVIF up to 8 MB. Saved as HD WebP.</p>
          {busy && (
            <div className="mt-2 h-1 w-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
          )}
          {note.text && (
            <p className={`mt-2 text-xs ${note.type === 'ok' ? 'text-emerald-400' : 'text-red-400'}`} role="status">
              {note.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Login ------------------------------ */
function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { token } = await loginAdmin(username.trim(), password);
      onSuccess(token);
    } catch (err) {
      setError(errorMessage(err, 'Sign-in failed. Try again.'));
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <form onSubmit={submit} className="carbon w-full max-w-md border border-white/10 p-8 shadow-2xl" noValidate>
        <div className="flex items-center gap-3">
          <Lock className="text-accent" size={22} aria-hidden="true" />
          <h1 className="font-heading text-2xl font-black uppercase tracking-tight">
            PIT<span className="text-accent">500</span> Admin
          </h1>
        </div>
        <p className="mt-2 text-sm text-ash">Sign in to edit the live website.</p>

        <div className="mt-8 space-y-5">
          <Field id="username" label="Username" value={username} onChange={setUsername} autoComplete="username" autoFocus />
          <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>

        {error && (
          <p className="mt-5 flex items-start gap-2 border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300" role="alert">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 font-heading text-sm font-extrabold uppercase tracking-wider text-black transition-all duration-300 hover:bg-white disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {busy ? 'Signing in' : 'Sign in'}
        </button>
        <a href="/" className="mt-5 block text-center text-sm text-ash transition-colors hover:text-accent">
          Back to the website
        </a>
      </form>
    </div>
  );
}

/* --------------------------- Password change --------------------------- */
function PasswordCard({ token, onExpired }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [state, setState] = useState({ busy: false, ok: '', error: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (next.length < 10) {
      setState({ busy: false, ok: '', error: 'New password must be at least 10 characters.' });
      return;
    }
    setState({ busy: true, ok: '', error: '' });
    try {
      await changePassword(token, current, next);
      setCurrent('');
      setNext('');
      setState({ busy: false, ok: 'Password updated.', error: '' });
    } catch (err) {
      if (err?.response?.status === 401 && /session|token/i.test(err.response.data?.message || '')) return onExpired();
      setState({ busy: false, ok: '', error: errorMessage(err) });
    }
  };

  return (
    <form onSubmit={submit} className="border border-white/10 bg-charcoal p-6" noValidate>
      <h2 className="font-heading text-lg font-extrabold uppercase">Change admin password</h2>
      <p className="mt-1 text-sm text-ash">Replace the starter password the first time you sign in.</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field id="pw-current" label="Current password" type="password" value={current} onChange={setCurrent} autoComplete="current-password" />
        <Field id="pw-new" label="New password" type="password" value={next} onChange={setNext} autoComplete="new-password" hint="At least 10 characters." />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.busy || !current || !next}
          className="inline-flex items-center gap-2 border-2 border-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-accent transition-all duration-300 hover:bg-accent hover:text-black disabled:opacity-50"
        >
          {state.busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Update password
        </button>
        <p className="text-sm" role="status">
          {state.ok && <span className="text-emerald-400">{state.ok}</span>}
          {state.error && <span className="text-red-400">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}

/* ----------------------------- Dashboard ----------------------------- */
function validate(form) {
  const errors = {};
  if (!form.heroHeadline.trim()) errors.heroHeadline = 'Add a headline.';
  const hero = form.heroImageUrl.trim();
  if (hero && !/^(https?:\/\/|\/)/i.test(hero)) errors.heroImageUrl = 'Start the image link with https:// or /.';
  const about = (form.aboutImageUrl || '').trim();
  if (about && !/^(https?:\/\/|\/)/i.test(about)) errors.aboutImageUrl = 'Start the image link with https:// or /.';
  const digits = form.whatsappNumber.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) errors.whatsappNumber = 'Use 10 to 15 digits including country code, e.g. 919876543210.';
  if (!form.storeAddress.trim()) errors.storeAddress = 'Add the store address.';
  if (!form.storeTimings.trim()) errors.storeTimings = 'Add the opening hours.';
  form.categories.forEach((c, i) => {
    if (!c.title.trim()) errors[`cat-${i}-title`] = 'Add a category name.';
    const img = c.imagePlaceholderUrl.trim();
    if (img && !/^(https?:\/\/|\/)/i.test(img)) errors[`cat-${i}-img`] = 'Start the image link with https:// or /.';
  });
  return errors;
}

function Dashboard({ token, onLogout }) {
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState({});
  const [save, setSave] = useState({ state: 'idle', message: '' }); // idle | saving | success | error

  useEffect(() => {
    let cancelled = false;
    fetchContent()
      .then((data) => !cancelled && setForm({ ...DEFAULT_CONTENT, ...data }))
      .catch((err) => {
        if (cancelled) return;
        setLoadError(`${errorMessage(err)} Showing starter copy instead.`);
        setForm(DEFAULT_CONTENT);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSave((s) => (s.state === 'saving' ? s : { state: 'idle', message: '' }));
  };

  const setCategory = (index, key) => (value) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    }));
    setSave((s) => (s.state === 'saving' ? s : { state: 'idle', message: '' }));
  };

  const publish = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setSave({ state: 'error', message: 'Fix the highlighted fields, then publish again.' });
      return;
    }
    setSave({ state: 'saving', message: '' });
    try {
      const { content } = await saveContent(token, form);
      setForm({ ...DEFAULT_CONTENT, ...content });
      setSave({ state: 'success', message: 'Published. The live site now shows these updates.' });
    } catch (err) {
      if (err?.response?.status === 401) {
        onLogout();
        return;
      }
      setSave({ state: 'error', message: errorMessage(err, 'Could not publish. Try again.') });
    }
  };

  if (!form) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ash">
        <Loader2 className="mr-3 animate-spin" aria-hidden="true" /> Loading content
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-40 pt-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight">
          PIT<span className="text-accent">500</span> Control Center
        </h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm text-white transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ExternalLink size={14} aria-hidden="true" /> View site
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-sm text-white transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <LogOut size={14} aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>

      {loadError && (
        <p className="mt-6 flex items-start gap-2 border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-200" role="alert">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {loadError}
        </p>
      )}

      <div className="mt-8 space-y-8">
        <section className="border border-white/10 bg-charcoal p-6">
          <h2 className="font-heading text-lg font-extrabold uppercase">Hero</h2>
          <div className="mt-5 space-y-5">
            <Field
              id="heroHeadline"
              label="Headline"
              value={form.heroHeadline}
              onChange={setField('heroHeadline')}
              error={errors.heroHeadline}
              hint="Each sentence appears on its own line; the last one is highlighted."
              maxLength={160}
            />
            <Field
              id="heroSubheadline"
              label="Subheadline"
              multiline
              rows={3}
              value={form.heroSubheadline}
              onChange={setField('heroSubheadline')}
              maxLength={400}
            />
            <ImageField
              id="heroImageUrl"
              label="Hero image"
              value={form.heroImageUrl}
              onChange={setField('heroImageUrl')}
              error={errors.heroImageUrl}
              hint="Optional. Upload a photo or paste a link. Empty uses /images/hero.jpg from the site."
              token={token}
              onExpired={onLogout}
            />
            <ImageField
              id="aboutImageUrl"
              label="About section banner image"
              value={form.aboutImageUrl}
              onChange={setField('aboutImageUrl')}
              error={errors.aboutImageUrl}
              hint="Optional wide photo of the showroom. Empty uses /images/about.jpg, or hides the banner if that file is missing."
              token={token}
              onExpired={onLogout}
            />
          </div>
        </section>

        <section className="border border-white/10 bg-charcoal p-6">
          <h2 className="font-heading text-lg font-extrabold uppercase">Store details</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field
                id="storeAddress"
                label="Address"
                multiline
                rows={2}
                value={form.storeAddress}
                onChange={setField('storeAddress')}
                error={errors.storeAddress}
                maxLength={300}
              />
            </div>
            <Field
              id="storeTimings"
              label="Opening hours"
              value={form.storeTimings}
              onChange={setField('storeTimings')}
              error={errors.storeTimings}
              hint='Write times like "10:00 AM - 9:00 PM" so the site can show Open now.'
              maxLength={200}
            />
            <Field
              id="whatsappNumber"
              label="WhatsApp number"
              type="tel"
              inputMode="numeric"
              value={form.whatsappNumber}
              onChange={setField('whatsappNumber')}
              error={errors.whatsappNumber}
              hint="Country code first, digits only, e.g. 919876543210."
              maxLength={20}
            />
          </div>
        </section>

        <section className="border border-white/10 bg-charcoal p-6">
          <h2 className="font-heading text-lg font-extrabold uppercase">Categories</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {form.categories.map((c, i) => (
              <fieldset key={c.id} className="space-y-4 border border-white/10 bg-asphalt p-5">
                <legend className="px-2 text-sm font-semibold text-accent">Category {i + 1}</legend>
                <Field
                  id={`cat-${i}-title`}
                  label="Name"
                  value={c.title}
                  onChange={setCategory(i, 'title')}
                  error={errors[`cat-${i}-title`]}
                  maxLength={80}
                />
                <Field
                  id={`cat-${i}-desc`}
                  label="Description"
                  multiline
                  rows={3}
                  value={c.description}
                  onChange={setCategory(i, 'description')}
                  maxLength={400}
                />
                <ImageField
                  id={`cat-${i}-img`}
                  label="Category image"
                  value={c.imagePlaceholderUrl}
                  onChange={setCategory(i, 'imagePlaceholderUrl')}
                  error={errors[`cat-${i}-img`]}
                  hint="Optional. Upload a photo or paste a link."
                  token={token}
                  onExpired={onLogout}
                />
              </fieldset>
            ))}
          </div>
        </section>

        <PasswordCard token={token} onExpired={onLogout} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-asphalt/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="min-h-[1.25rem] text-sm" role="status" aria-live="polite">
            {save.state === 'saving' && <span className="text-ash">Publishing to the live site</span>}
            {save.state === 'success' && (
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <Check size={16} aria-hidden="true" /> {save.message}
              </span>
            )}
            {save.state === 'error' && (
              <span className="inline-flex items-center gap-2 text-red-400">
                <AlertTriangle size={16} aria-hidden="true" /> {save.message}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={publish}
            disabled={save.state === 'saving'}
            className="inline-flex items-center justify-center gap-2 bg-accent px-8 py-4 font-heading text-sm font-extrabold uppercase tracking-wider text-black transition-all duration-300 hover:bg-white disabled:opacity-60"
          >
            {save.state === 'saving' && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            Publish Live Updates to Pit500
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Shell ------------------------------- */
export default function AdminPage() {
  const [token, setToken] = useState(storage.get);

  const logout = useCallback(() => {
    storage.clear();
    setToken(null);
  }, []);

  const handleLogin = (t) => {
    storage.set(t);
    setToken(t);
  };

  return (
    <div className="min-h-screen bg-asphalt text-white">
      {token ? <Dashboard token={token} onLogout={logout} /> : <Login onSuccess={handleLogin} />}
    </div>
  );
}
