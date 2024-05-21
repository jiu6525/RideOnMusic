import { useTokenStore } from "@/stores/spotifyToken";
import { usePlaylistStore } from "@/stores/playlist";
import { useSearchStore } from "@/stores/search";
import { useTrackStore } from '@/stores/track';
import { useUserStore } from '@/stores/SpotifyUser';
export default { useTokenStore, useUserStore, usePlaylistStore, useSearchStore, useTrackStore }