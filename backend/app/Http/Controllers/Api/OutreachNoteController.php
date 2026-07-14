<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOutreachNoteRequest;
use App\Http\Resources\OutreachNoteResource;
use App\Models\Outreach;
use App\Models\OutreachNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OutreachNoteController extends Controller
{
    public function index(Outreach $outreach): AnonymousResourceCollection
    {
        $this->authorizeAccess($outreach);

        $notes = $outreach->notes()
            ->orderBy('created_at', 'desc')
            ->get();

        return OutreachNoteResource::collection($notes);
    }

    public function store(StoreOutreachNoteRequest $request, Outreach $outreach): JsonResponse
    {
        $this->authorizeAccess($outreach);

        $note = $outreach->notes()->create([
            'note' => $request->validated()['note'],
        ]);

        return response()->json(new OutreachNoteResource($note), 201);
    }

    public function destroy(Outreach $outreach, OutreachNote $note): JsonResponse
    {
        $this->authorizeAccess($outreach);

        if ($note->outreach_id !== $outreach->id) {
            abort(404);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }

    private function authorizeAccess(Outreach $outreach): void
    {
        if ($outreach->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
    }
}
